import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mailer from 'nodemailer';
import { UserService } from 'src/user/user.service';
import * as cryptoJs from 'crypto-js';
type checkMailType = {
  email: string;
  token: string;
  time: number;
  resolver: (value: boolean) => void;
};

const checkMailMap = new Map<string, checkMailType>();

@Injectable()
export class MailerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}
  async sendEmail(email: string) {
    // email 전송을 위한 기본 값들
    const smtp = this.configService.get<string>('SMTP');
    const smtpId = this.configService.get<string>('SMTP_ID');
    const smtpPw = this.configService.get<string>('PRIVKEY');
    const smtpPort = this.configService.get<string>('SMTP_PORT');
    const smtpFromName = this.configService.get<string>('SMTP_FROM_NAME');
    const smtpFromEmail = this.configService.get<string>('SMTP_FROM_EMAIL');

    const transporter = mailer.createTransport({
      host: smtp,
      port: +smtpPort,
      auth: {
        user: smtpId,
        pass: smtpPw,
      },
      secure: false,
      // 서명받지 않은 사이트의 요청도 받겠다.
      tls: {
        rejectUnauthorized: false,
      },
    });
    // 토큰 유효시간 내에 인증을 못하면 토큰이 사라져야댐
    const sendtime = +new Date();
    const token = this.makeToken(email, sendtime);
    const checkMailLink = `http://localhost:3000/mailer/check?q=${encodeURIComponent(token)}`;

    const promise = new Promise<boolean>((resolve) => {
      checkMailMap.set(token, {
        email,
        token,
        time: sendtime,
        resolver: resolve,
      });
    });

    const result = await transporter.sendMail({
      from: `${smtpFromName} <${smtpFromEmail}>`,
      to: `${email}`,
      subject: '일잘로 회원가입 인증',
      html: `
          <html>
          <head>
              <style>
                  /* Your CSS styles here */
                  body {
                      font-family: Arial, sans-serif;
                      background-color: #f8f9fa;
                      padding: 20px;
                  }
                  .container {
                      max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #fff;
                      border-radius: 8px;
                      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                      color: #333;
                      text-align: center;
                  }
                  p {
                      font-size: 16px;
                      line-height: 1.5;
                  }
                  a {
                      color: #007bff;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <h1>일잘로 초대 메일</h1>
                  <p>안녕하세요, 일잘로에 초대되셨습니다. 아래 링크를 클릭하여 인증을 완료하세요.</p>
                  <p><a href="${checkMailLink}">클릭하여 인증을 완료하세요.</a></p>
              </div>
          </body>
          </html>
      `,
    });
    // 10 minutes expiration

    await promise;

    return result;
  }

  async checkToken(token: string) {
    //토큰 만료시간
    const EXPIRED_TIME = 1000 * 10;
    const NOW = +new Date();
    const hasTokenInStore = checkMailMap.has(token);
    const tokenInfo = checkMailMap.get(token);
    // 상태값으로 보내기 위해
    let flag: string = '';
    if (hasTokenInStore) {
      const { email, token, time, resolver } = tokenInfo;
      const isExpired = NOW - time > EXPIRED_TIME;
      if (isExpired) {
        flag = 'expired';
      }
      // DB에 입력한 이메일과 일치하는 유저 있나 확인
      const user = await this.userService.findByEmail(email);

      if (user) {
        resolver(true);
        flag = 'success';
      } else {
        flag = 'no exists';
      }
    } else {
      flag = 'token no exists';
    }
    // 토큰 삭제
    checkMailMap.delete(token);
    return flag;
  }

  private makeToken(email: string, sendtime: number) {
    const token = cryptoJs
      .HmacSHA256(
        'check' + email + '|' + sendtime + '|' + 'localhost:3000',
        this.configService.get<string>('PRIVKEY'),
      )
      .toString();
    console.log('Generated token:', token); // 토큰 값 확인
    return token;
  }

  handleResponsePage(status: string): string {
    switch (status) {
      case 'success':
        return '이메일 주소가 성공적으로 확인되었습니다.';
      case 'expired':
        return '이메일 확인이 만료되었습니다. 새로운 확인 이메일을 요청하십시오.';
      case 'no exists':
        return '일치하는 사용자가 없습니다.';
      case 'token no exists':
        return '토큰이 없거나 만료되었습니다. 새로운 확인 이메일을 요청하십시오.';
      default:
        return '인증 오류가 발생했습니다.';
    }
  }
}
