import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('token/access')
  async createTokenAccess(@Headers('authorization') rawToken: string) {
    const token = await this.authService.extractTokenFromHeader(rawToken, true); // true => Bearer 타입
    const newToken = await this.authService.rotateToken(token, false); // false니까 Access Token 나옴
    return {
      message: 'Access Token 재발급에 성공하였습니다.',
      accessToken: newToken,
    };
  }

  @Post('token/refresh')
  createTokenRefresh(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true); // true => Bearer 타입
    const newToken = this.authService.rotateToken(token, true); // true니까 Refresh Token 나옴
    return {
      message: 'Refresh Token 재발급에 성공하였습니다.',
      refreshToken: newToken,
    };
  }

  @Post('login')
  async loginEmail(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const data = await this.authService.loginWithEmail({ email, password });
    return { message: '로그인에 성공하였습니다.', data };
  }

  @Post('logout')
  async logoutEmail(@Headers('authorization') rawToken: string) {
    const token = this.authService.extractTokenFromHeader(rawToken, true);
    await this.authService.logout(token, true);
    return { message: '로그아웃에 성공하였습니다.' };
  }

  /**
   * Basic Token 사용해서 로그인
   */
  // @Post('login/email')
  // // 헤더에 원하는 키 값 넣어줄 수 있음
  // loginEmail(@Headers('authorization') rawToken: string) {
  //   // enail:password -> base64
  //   const token = this.authService.extractTokenFromHeader(rawToken, false);

  //   const credentials = this.authService.decodeBasicToken(token);

  //   return this.authService.loginWithEmail(credentials);
  // }

  @Post('register')
  async registerEmail(@Body() createUserDto: CreateUserDto) {
    const data = await this.authService.registerWithEmail(createUserDto);
    return { message: '회원 가입에 성공하였습니다.', data };
  }
}
