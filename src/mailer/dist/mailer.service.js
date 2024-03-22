"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.MailerService = void 0;
var common_1 = require("@nestjs/common");
var mailer = require("nodemailer");
var cryptoJs = require("crypto-js");
var checkMailMap = new Map();
var MailerService = /** @class */ (function () {
    function MailerService(configService, userService) {
        this.configService = configService;
        this.userService = userService;
    }
    MailerService.prototype.sendEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var smtp, smtpId, smtpPw, smtpPort, smtpFromName, smtpFromEmail, transporter, sendtime, token, checkMailLink, promise, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        smtp = this.configService.get('SMTP');
                        smtpId = this.configService.get('SMTP_ID');
                        smtpPw = this.configService.get('PRIVKEY');
                        smtpPort = this.configService.get('SMTP_PORT');
                        smtpFromName = this.configService.get('SMTP_FROM_NAME');
                        smtpFromEmail = this.configService.get('SMTP_FROM_EMAIL');
                        transporter = mailer.createTransport({
                            host: smtp,
                            port: +smtpPort,
                            auth: {
                                user: smtpId,
                                pass: smtpPw
                            },
                            secure: false,
                            // 서명받지 않은 사이트의 요청도 받겠다.
                            tls: {
                                rejectUnauthorized: false
                            }
                        });
                        sendtime = +new Date();
                        token = this.makeToken(email, sendtime);
                        checkMailLink = "http://localhost:3000/mailer/check?q=" + encodeURIComponent(token);
                        promise = new Promise(function (resolve) {
                            checkMailMap.set(token, {
                                email: email,
                                token: token,
                                time: sendtime,
                                resolver: resolve
                            });
                        });
                        return [4 /*yield*/, transporter.sendMail({
                                from: smtpFromName + " <" + smtpFromEmail + ">",
                                to: "" + email,
                                subject: '일잘로 회원가입 인증',
                                html: "\n          <html>\n          <head>\n              <style>\n                  /* Your CSS styles here */\n                  body {\n                      font-family: Arial, sans-serif;\n                      background-color: #f8f9fa;\n                      padding: 20px;\n                  }\n                  .container {\n                      max-width: 600px;\n                      margin: 0 auto;\n                      padding: 20px;\n                      background-color: #fff;\n                      border-radius: 8px;\n                      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);\n                  }\n                  h1 {\n                      color: #333;\n                      text-align: center;\n                  }\n                  p {\n                      font-size: 16px;\n                      line-height: 1.5;\n                  }\n                  a {\n                      color: #007bff;\n                  }\n              </style>\n          </head>\n          <body>\n              <div class=\"container\">\n                  <h1>\uC77C\uC798\uB85C \uCD08\uB300 \uBA54\uC77C</h1>\n                  <p>\uC548\uB155\uD558\uC138\uC694, \uC77C\uC798\uB85C\uC5D0 \uCD08\uB300\uB418\uC168\uC2B5\uB2C8\uB2E4. \uC544\uB798 \uB9C1\uD06C\uB97C \uD074\uB9AD\uD558\uC5EC \uC778\uC99D\uC744 \uC644\uB8CC\uD558\uC138\uC694.</p>\n                  <p><a href=\"" + checkMailLink + "\">\uD074\uB9AD\uD558\uC5EC \uC778\uC99D\uC744 \uC644\uB8CC\uD558\uC138\uC694.</a></p>\n              </div>\n          </body>\n          </html>\n      "
                            })];
                    case 1:
                        result = _a.sent();
                        return [4 /*yield*/, promise];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    MailerService.prototype.checkToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var EXPIRED_TIME, NOW, hasTokenInStore, tokenInfo, flag, email, token_1, time, resolver, isExpired;
            return __generator(this, function (_a) {
                EXPIRED_TIME = 1000 * 10 * 10;
                NOW = +new Date();
                hasTokenInStore = checkMailMap.has(token);
                tokenInfo = checkMailMap.get(token);
                flag = '';
                if (hasTokenInStore) {
                    email = tokenInfo.email, token_1 = tokenInfo.token, time = tokenInfo.time, resolver = tokenInfo.resolver;
                    isExpired = NOW - time > EXPIRED_TIME;
                    if (isExpired) {
                        flag = 'expired';
                    }
                    else {
                        flag = 'success';
                        resolver(true);
                    }
                }
                else {
                    flag = 'token no exists';
                }
                // 토큰 삭제
                checkMailMap["delete"](token);
                console.log('MailerService ~ checkToken ~ flag:', flag);
                return [2 /*return*/, flag];
            });
        });
    };
    MailerService.prototype.makeToken = function (email, sendtime) {
        var token = cryptoJs
            .HmacSHA256('check' + email + '|' + sendtime + '|' + 'localhost:3000', this.configService.get('PRIVKEY'))
            .toString();
        console.log('Generated token:', token); // 토큰 값 확인
        return token;
    };
    MailerService.prototype.handleResponsePage = function (status) {
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
    };
    MailerService = __decorate([
        common_1.Injectable()
    ], MailerService);
    return MailerService;
}());
exports.MailerService = MailerService;
