"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var user_entity_1 = require("src/user/entities/user.entity");
var bcrypt = require("bcrypt");
var typeorm_1 = require("@nestjs/typeorm");
var AuthService = /** @class */ (function () {
    function AuthService(dataSource, jwtService, userService, mailerService, userRepository) {
        this.dataSource = dataSource;
        this.jwtService = jwtService;
        this.userService = userService;
        this.mailerService = mailerService;
        this.userRepository = userRepository;
    }
    /**
     * 1) registerWithEmail
     *    - email, name, password 입력 받고 사용자 생성
     *    - 생성이 완료되면 accessToken과 refreshToken을 반환. => 회원 가입 후 바로 로그인 할 수 있게
     *
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
    AuthService.prototype.signToken = function (user, isRefreshToken) {
        var payload = {
            email: user.email,
            sub: user.id,
            type: isRefreshToken ? 'refresh' : 'access'
        };
        return this.jwtService.sign(payload);
    };
    AuthService.prototype.loginUser = function (user) {
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true)
        };
    };
    AuthService.prototype.registerWithEmail = function (createUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            var email, name, password, queryRunner, emailExist, hashedPassword, user, newUser, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = createUserDto.email, name = createUserDto.name, password = createUserDto.password;
                        queryRunner = this.dataSource.createQueryRunner();
                        return [4 /*yield*/, queryRunner.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.startTransaction()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 9, 11, 13]);
                        return [4 /*yield*/, this.userRepository.exists({
                                where: { email: email }
                            })];
                    case 4:
                        emailExist = _a.sent();
                        if (emailExist)
                            throw new common_1.BadRequestException('이미 존재하는 email입니다.');
                        return [4 /*yield*/, bcrypt.hash(password, 10)];
                    case 5:
                        hashedPassword = _a.sent();
                        user = this.userRepository.create({
                            email: email,
                            password: hashedPassword,
                            name: name
                        });
                        return [4 /*yield*/, this.mailerService.sendEmail(email)];
                    case 6:
                        _a.sent();
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 7:
                        newUser = _a.sent();
                        return [4 /*yield*/, queryRunner.commitTransaction()];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, this.loginUser(newUser)];
                    case 9:
                        err_1 = _a.sent();
                        return [4 /*yield*/, queryRunner.rollbackTransaction()];
                    case 10:
                        _a.sent();
                        throw err_1;
                    case 11: return [4 /*yield*/, queryRunner.release()];
                    case 12:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 13: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.authenticateWithEamilAndPassword = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, passwordCheck;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userService.findByEmail(user.email)];
                    case 1:
                        existingUser = _a.sent();
                        if (!existingUser)
                            throw new common_1.UnauthorizedException('존재하지 않는 사용자 입니다.');
                        return [4 /*yield*/, bcrypt.compare(user.password, existingUser.password)];
                    case 2:
                        passwordCheck = _a.sent();
                        if (!passwordCheck)
                            throw new common_1.UnauthorizedException('비밀번호가 일치하지 않습니다');
                        return [2 /*return*/, existingUser];
                }
            });
        });
    };
    // 이거 하나 실행하면 로그인 유효성 검사 | 토큰 반환 쌉가넝
    AuthService.prototype.loginWithEmail = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.authenticateWithEamilAndPassword(user)];
                    case 1:
                        existingUser = _a.sent();
                        return [2 /*return*/, this.loginUser(existingUser)];
                }
            });
        });
    };
    /** 헤더에서 토큰을 받을 때
     * 1) Basic {token}
     * 2) Berarer {token}
     * 띄어쓰기 기준으로 좌키 우값
     */
    // 헤더에서 토큰 뽑기 => 검증하여 토큰만!
    AuthService.prototype.extractTokenFromHeader = function (header, isBearer) {
        var splitToken = header.split(' ');
        var prefix = isBearer ? 'Bearer' : 'Basic';
        // 타입과 토큰만 있음 되니께 2여야만 함 || 토큰 타입이 위에 2가지가 아닐 때
        // =>토큰 형태 검사
        if (splitToken.length !== 2 || splitToken[0] !== prefix)
            throw new common_1.UnauthorizedException('잘못된 토큰입니다.');
        var token = splitToken[1];
        return token;
    };
    /**
     * Basic roasasdasdnflsadnbl;skbadg
     * 1) roasasdasdnflsadnbl;skbadg -> email:password
     * 2) email:password -> [email, password]
     * 3) {email,password}
     */
    AuthService.prototype.decodeBasicToken = function (base64String) {
        // base64 -> utf8  변환 -> 1번 모양으로 바뀜
        var decoded = Buffer.from(base64String, 'base64').toString('utf8');
        // (2번) 과정
        var split = decoded.split(':');
        if (split.length !== 2)
            throw new common_1.UnauthorizedException('잘못된 유형의 토큰입니다.');
        var email = split[0];
        var password = split[1];
        // (3)번 과정
        return { email: email, password: password };
    };
    //토큰 검증
    AuthService.prototype.verifyToken = function (token) {
        return this.jwtService.verify(token);
    };
    // Access Token 만료 뒤에도 Refresh Token 이용하여 로그인 할 수 있는 토큰 뱉기
    // 보통 토큰 재발급은 => rotate 라고 함
    AuthService.prototype.rotateToken = function (token, isRefreshToken) {
        var decoded = this.jwtService.verify(token);
        // payload -> email, sub, type
        // 재발급은 refresh 이어야 함.
        if (decoded.type !== 'refresh')
            throw new common_1.UnauthorizedException('Refresh Token으로만 재발급이 가능합니다.');
        return this.signToken(__assign({}, decoded), isRefreshToken);
    };
    AuthService = __decorate([
        common_1.Injectable(),
        __param(4, typeorm_1.InjectRepository(user_entity_1.User))
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
