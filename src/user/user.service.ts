import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import _ from 'lodash';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { DeleteUserDto } from './dto/delete-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async deleteUser(id: number, deleteUserDto: DeleteUserDto) {
    const { password } = deleteUserDto;
    // 1) user 찾기
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    // 2)비밀번호 비교
    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck)
      throw new UnauthorizedException('비밀번호가 일치하지 않습니다');

    await this.userRepository.delete({ id });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { name, password, newPassword } = updateUserDto;
    // 1)유저 찾기
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    // 2)비밀번호 비교
    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck)
      throw new BadRequestException('비밀번호가 일치하지 않습니다');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // user.name = name;
    // user.password = hashedPassword;

    // 3)데이터수정
    await this.userRepository.update(
      { id },
      { name, password: hashedPassword },
    );
    await this.userRepository.save(user);
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  //   async createUser(createUserDto: CreateUserDto) {
  //     const { email, password, name } = createUserDto;

  //     // email 존재 여부 exists() -> 해당 값이 있으면 true 반환
  //     const emailExist = await this.userRepository.exists({
  //       where: { email: createUserDto.email },
  //     });
  //     if (emailExist) throw new BadRequestException('이미 존재하는 email입니다.');

  //     const user = this.userRepository.create({
  //       email,
  //       password,
  //       name,
  //     });

  //     const newUser = await this.userRepository.save(user);
  //     return newUser;
  //   }
}
// async login(loginUserDto: LoginUserDto): Promise<any> {
//   const { email, password } = loginUserDto;
//   const user = await this.userRepository.findOne({
//     select: ['id', 'email', 'password'],
//     where: { email },
//   });
//   if (_.isNil(user)) {
//     throw new UnauthorizedException('이메일을 확인해주세요.');
//   }

//   if (!(await compare(password, user.password))) {
//     throw new UnauthorizedException('비밀번호를 확인해주세요.');
//   }

//   const payload = { email, sub: user.id };
//   return {
//     access_token: this.jwtService.sign(payload),
//   };
// }
