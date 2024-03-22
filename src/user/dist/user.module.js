"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UserModule = void 0;
var common_1 = require("@nestjs/common");
var user_controller_1 = require("./user.controller");
var user_service_1 = require("./user.service");
var typeorm_1 = require("@nestjs/typeorm");
var jwt_1 = require("@nestjs/jwt");
var passport_1 = require("@nestjs/passport");
var config_1 = require("@nestjs/config");
var user_entity_1 = require("./entities/user.entity");
var jwt_strategy_1 = require("src/auth/strategies/jwt.strategy");
var mailer_module_1 = require("src/mailer/mailer.module");
var UserModule = /** @class */ (function () {
    function UserModule() {
    }
    UserModule = __decorate([
        common_1.Module({
            imports: [
                passport_1.PassportModule.register({ defaultStrategy: 'jwt', session: false }),
                typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
                jwt_1.JwtModule.registerAsync({
                    useFactory: function (config) { return ({
                        secret: config.get('JWT_SECRET_KEY')
                    }); },
                    inject: [config_1.ConfigService]
                }),
                common_1.forwardRef(function () { return mailer_module_1.MailerModule; }),
            ],
            providers: [user_service_1.UserService, jwt_strategy_1.JwtStrategy],
            controllers: [user_controller_1.UserController],
            exports: [user_service_1.UserService]
        })
    ], UserModule);
    return UserModule;
}());
exports.UserModule = UserModule;
