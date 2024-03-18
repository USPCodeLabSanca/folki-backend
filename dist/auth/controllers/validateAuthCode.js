"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuthCode = void 0;
var db_1 = __importDefault(require("../../db"));
var auth_1 = __importDefault(require("../../settings/auth"));
var createToken_1 = __importDefault(require("../services/createToken"));
var mixpanel_1 = __importDefault(require("../../utils/mixpanel"));
var validateAuthCode = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, authCode, user, intervalFromLastTry, userAuth, isEnvLogin, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, userId = _a.userId, authCode = _a.authCode;
                if (!userId || !authCode)
                    return [2 /*return*/, res.status(400).send({ title: 'Dados inválidos', message: 'userId e authCode são obrigatórios' })];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 10, , 11]);
                return [4 /*yield*/, db_1.default.user.findUnique({ where: { id: Number(userId) } })];
            case 2:
                user = _b.sent();
                if (!user)
                    return [2 /*return*/, res.status(404).send({ title: 'Usuário não encontrado', message: 'Usuário não encontrado' })];
                if (!(user.authTimesTried === auth_1.default.tryLimits)) return [3 /*break*/, 5];
                intervalFromLastTry = new Date().getTime() - user.lastAuthTry.getTime();
                if (!(intervalFromLastTry < auth_1.default.tryInterval)) return [3 /*break*/, 3];
                return [2 /*return*/, res.status(400).send({
                        title: 'Erro de Autenticação',
                        message: 'Você excedeu o limite de tentativas - Tente novamente mais tarde',
                    })];
            case 3: return [4 /*yield*/, db_1.default.user.update({ where: { id: user.id }, data: { authTimesTried: 0 } })];
            case 4:
                _b.sent();
                user.authTimesTried = 0;
                _b.label = 5;
            case 5: return [4 /*yield*/, db_1.default.user.update({
                    where: { id: user.id },
                    data: { authTimesTried: user.authTimesTried + 1, lastAuthTry: new Date() },
                })];
            case 6:
                _b.sent();
                return [4 /*yield*/, db_1.default.user_auth.findFirst({
                        where: { userId: Number(userId), authCode: authCode },
                        orderBy: { createdAt: 'desc' },
                    })];
            case 7:
                userAuth = _b.sent();
                isEnvLogin = userId === Number(process.env.USER_ID) && authCode === process.env.AUTH_CODE;
                if (!userAuth && !isEnvLogin)
                    return [2 /*return*/, res.status(400).send({ title: 'Erro de Autenticação', message: 'Código de Autenticação Inválido' })];
                mixpanel_1.default.track('Email Validated', {
                    distinct_id: user.email,
                });
                return [4 /*yield*/, db_1.default.user_auth.deleteMany({ where: { userId: Number(userId) } })];
            case 8:
                _b.sent();
                return [4 /*yield*/, db_1.default.user.update({
                        where: { id: user.id },
                        data: { authTimesTried: 0, isVerified: true, lastLogin: new Date() },
                    })];
            case 9:
                _b.sent();
                token = (0, createToken_1.default)(user.id, user.securePin);
                // @ts-ignore
                delete user.securePin;
                return [2 /*return*/, res.send({ token: token, user: user })];
            case 10:
                error_1 = _b.sent();
                console.error("[ERROR] [Validate Auth Code] Unexpected Auth Error: ".concat(error_1.message));
                res.status(500).send({
                    title: 'Erro de Autenticação',
                    message: 'Erro inesperado ao validar código de verificação - Tente novamente depois',
                });
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
exports.validateAuthCode = validateAuthCode;
