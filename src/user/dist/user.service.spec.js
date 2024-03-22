"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.UserService = void 0;
var common_1 = require("@nestjs/common");
var user_entity_1 = require("./entities/user.entity");
var typeorm_1 = require("@nestjs/typeorm");
var bcrypt = require("bcrypt");
var UserService = /** @class */ (function () {
    function UserService(userRepository) {
        this.userRepository = userRepository;
    }
    UserService.prototype.deleteUser = function (id, deleteUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            var password, user, passwordCheck;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        password = deleteUserDto.password;
                        return [4 /*yield*/, this.userRepository.findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
                        }
                        return [4 /*yield*/, bcrypt.compare(password, user.password)];
                    case 2:
                        passwordCheck = _a.sent();
                        if (!passwordCheck)
                            throw new common_1.UnauthorizedException('비밀번호가 일치하지 않습니다');
                        return [4 /*yield*/, this.userRepository["delete"]({ id: id })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.updateUser = function (id, updateUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            var name, password, newPassword, user, passwordCheck, hashedPassword;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        name = updateUserDto.name, password = updateUserDto.password, newPassword = updateUserDto.newPassword;
                        return [4 /*yield*/, this.userRepository.findOneBy({ id: id })];
                    case 1:
                        user = _a.sent();
                        console.log('UserService ~ updateUser ~ user:', user);
                        if (!user) {
                            throw new common_1.NotFoundException('사용자를 찾을 수 없습니다.');
                        }
                        return [4 /*yield*/, bcrypt.compare(password, user.password)];
                    case 2:
                        passwordCheck = _a.sent();
                        if (!passwordCheck)
                            throw new common_1.BadRequestException('비밀번호가 일치하지 않습니다');
                        return [4 /*yield*/, bcrypt.hash(newPassword, 10)];
                    case 3:
                        hashedPassword = _a.sent();
                        // user.name = name;
                        // user.password = hashedPassword;
                        // 3)데이터수정
                        return [4 /*yield*/, this.userRepository.update({ id: id }, { name: name, password: hashedPassword })];
                    case 4:
                        // user.name = name;
                        // user.password = hashedPassword;
                        // 3)데이터수정
                        _a.sent();
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    UserService.prototype.findByEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userRepository.findOneBy({ email: email })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    UserService.prototype.createUser = function (createUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, name, emailExist, user, newUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = createUserDto.email, password = createUserDto.password, name = createUserDto.name;
                        return [4 /*yield*/, this.findByEmail(email)];
                    case 1:
                        emailExist = _a.sent();
                        if (emailExist)
                            throw new common_1.BadRequestException('이미 존재하는 email입니다.');
                        user = this.userRepository.create({
                            email: email,
                            password: password,
                            name: name
                        });
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 2:
                        newUser = _a.sent();
                        return [2 /*return*/, newUser];
                }
            });
        });
    };
    UserService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(user_entity_1.User))
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
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
