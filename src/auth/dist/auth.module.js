"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthModule = void 0;
var common_1 = require("@nestjs/common");
var auth_service_1 = require("./auth.service");
var auth_controller_1 = require("./auth.controller");
var jwt_1 = require("@nestjs/jwt");
var config_1 = require("@nestjs/config");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("src/user/entities/user.entity");
var passport_1 = require("@nestjs/passport");
var jwt_strategy_1 = require("./strategies/jwt.strategy");
var user_module_1 = require("src/user/user.module");
var mailer_module_1 = require("src/mailer/mailer.module");
var mailer_service_1 = require("src/mailer/mailer.service");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
                passport_1.PassportModule.register({ defaultStrategy: 'jwt', session: false }),
                user_module_1.UserModule,
                mailer_module_1.MailerModule,
                jwt_1.JwtModule.registerAsync({
                    inject: [config_1.ConfigService],
                    useFactory: function (configService) { return ({
                        secret: configService.get('JWT_SECRET_KEY'),
                        signOptions: {
                            expiresIn: '12h'
                        }
                    }); }
                }),
            ],
            controllers: [auth_controller_1.AuthController],
            providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, mailer_service_1.MailerService],
            exports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User])]
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
