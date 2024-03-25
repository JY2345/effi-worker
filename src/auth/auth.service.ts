import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from 'src/mailer/mailer.service';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 1) registerWithEmail
   *    - email, name, password 입력 받고 사용자 생성
   *    - 생성이 완료되면 accessToken과 refreshToken을 반환. => 회원 가입 후 바로 로그인 할 수 있게

   * 2) loginWithEmail
   *    - email, password 입력하면 사용자 검증 진행
   *    - 검증이 완료되면 accessToken과 refreshToken을 반환
   *
   * 3) loginUser
   *    - (1)과 (2)에서 필요한 accessToken과 refreshToken을 반환하는 로직
   *
   * 4) singToken
   *    - 토큰 발급
   *    - (3)에서 필요한 accessToken과 refreshToken을 생성
   *
   * 5) authenticateWithEamilAndPassword
   *    - (2)에서 로그인을 진행할때 필요한 기본적인 검증
   *    1. 사용자가 존재하는지
   *    2. 비번이 일치하는지
   *    3. 모두 일치하면 사용자 정보 반환
   */

  signToken(user: Pick<User, 'email' | 'id'>, isRefreshToken: boolean) {
    const payload = {
      email: user.email,
      sub: user.id,
      type: isRefreshToken ? 'refresh' : 'access',
    };

    // 리프레시 토큰과 액세스 토큰의 유효기간 설정
    let expiresIn = '15m'; // 액세스 토큰 15분
    if (isRefreshToken) {
      expiresIn = '12h'; // 리프레시 토큰 유효기간 7일
      this.cacheManager.set(`REFRESH_TOKEN:${user.id}`, payload, {
        ttl: 60 * 60 * 24 * 7,
      }); // 캐시(redis)도 동일하게 지정
    }

    return this.jwtService.sign(payload, {
      expiresIn: expiresIn,
    });
  }

  loginUser(user: Pick<User, 'email' | 'id'>) {
    return {
      accessToken: this.signToken(user, false),
      refreshToken: this.signToken(user, true),
    };
  }
  async registerWithEmail(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const emailExist = await this.userRepository.exists({
        where: { email },
      });
      if (emailExist)
        throw new BadRequestException('이미 존재하는 email입니다.');
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        email,
        password: hashedPassword,
        name,
      });

      await this.mailerService.sendEmail(email);

      const newUser = await this.userRepository.save(user);

      await queryRunner.commitTransaction();
      return this.loginUser(newUser);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async authenticateWithEamilAndPassword(
    user: Pick<User, 'email' | 'password'>,
  ) {
    /*
     *    1. 사용자가 존재하는지 (email)
     *    2. 비번이 일치하는지
     *    3. 모두 일치하면 사용자 정보 반환
     */
    const existingUser = await this.userService.findByEmail(user.email);
    if (!existingUser)
      throw new UnauthorizedException('존재하지 않는 사용자 입니다.');

    // 받은 비번, 데이터 비번 비교
    const passwordCheck = await bcrypt.compare(
      user.password,
      existingUser.password,
    );

    if (!passwordCheck)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');

    return existingUser;
  }
  // 이거 하나 실행하면 로그인 유효성 검사 | 토큰 반환 쌉가넝
  async loginWithEmail(user: Pick<User, 'email' | 'password'>) {
    const existingUser = await this.authenticateWithEamilAndPassword(user);
    return this.loginUser(existingUser);
  }

  /** 헤더에서 토큰을 받을 때
   * 1) Basic {token}
   * 2) Berarer {token}
   * 띄어쓰기 기준으로 좌키 우값
   */

  // 헤더에서 토큰 뽑기 => 검증하여 토큰만!
  extractTokenFromHeader(header: string, isBearer: boolean) {
    const splitToken = header.split(' ');

    const prefix = isBearer ? 'Bearer' : 'Basic';

    // 타입과 토큰만 있음 되니께 2여야만 함 || 토큰 타입이 위에 2가지가 아닐 때
    // =>토큰 형태 검사
    if (splitToken.length !== 2 || splitToken[0] !== prefix)
      throw new UnauthorizedException('잘못된 토큰입니다.');

    const token = splitToken[1];

    return token;
  }
  /**
   * Basic roasasdasdnflsadnbl;skbadg
   * 1) roasasdasdnflsadnbl;skbadg -> email:password
   * 2) email:password -> [email, password]
   * 3) {email,password}
   */
  decodeBasicToken(base64String: string) {
    // base64 -> utf8  변환 -> 1번 모양으로 바뀜
    const decoded = Buffer.from(base64String, 'base64').toString('utf8');

    // (2번) 과정
    const split = decoded.split(':');
    if (split.length !== 2)
      throw new UnauthorizedException('잘못된 유형의 토큰입니다.');

    const email = split[0];
    const password = split[1];
    // (3)번 과정
    return { email, password };
  }

  //토큰 검증
  verifyToken(token: string) {
    return this.jwtService.verify(token);
  }
  // Access Token 만료 뒤에도 Refresh Token 이용하여 로그인 할 수 있는 토큰 뱉기
  // 보통 토큰 재발급은 => rotate 라고 함
  async rotateToken(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token);

    // payload -> email, sub, type
    // 재발급은 refresh 이어야 함.
    if (decoded.type !== 'refresh')
      throw new UnauthorizedException(
        'Refresh Token으로만 재발급이 가능합니다.',
      );

    const redis = await this.cacheManager.get(`REFRESH_TOKEN:${decoded.sub}`);

    if (!redis || redis !== token)
      throw new UnauthorizedException(
        '토큰이 존재하지 않거나, 일치하지 않습니다.',
      );

    return this.signToken({ ...decoded }, isRefreshToken);
  }
  async logout(token: string, isRefreshToken: boolean) {
    const decoded = this.jwtService.verify(token);
    const redis = await this.cacheManager.get(`REFRESH_TOKEN:${decoded.sub}`);

    if (!redis || redis !== token)
      throw new UnauthorizedException(
        '토큰이 존재하지 않거나, 일치하지 않습니다.',
      );

    await this.cacheManager.del(`REFRESH_TOKEN:${decoded.sub}`);
  }
}
