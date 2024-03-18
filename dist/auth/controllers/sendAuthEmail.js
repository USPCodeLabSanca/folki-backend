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
exports.sendAuthEmail = void 0;
var auth_utils_1 = require("../auth.utils");
var db_1 = __importDefault(require("../../db"));
var auth_1 = __importDefault(require("../../settings/auth"));
var sendEmail_1 = require("../services/sendEmail");
var mixpanel_1 = __importDefault(require("../../utils/mixpanel"));
var sendAuthEmail = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, user, intervalFromLastTry, authCode, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.body.email;
                if (!email)
                    return [2 /*return*/, res.status(400).send({ title: 'Email inválido', message: 'Por favor, insira um email válido' })];
                if (!(0, auth_utils_1.verifyUSPEmail)(email))
                    return [2 /*return*/, res.status(400).send({ title: 'Email inválido', message: 'Por favor, insira um email da USP' })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 12, , 13]);
                return [4 /*yield*/, db_1.default.user.findUnique({ where: { email: email } })];
            case 2:
                user = _a.sent();
                if (!!user) return [3 /*break*/, 4];
                return [4 /*yield*/, db_1.default.user.create({ data: { name: email, email: email } })];
            case 3:
                user = _a.sent();
                _a.label = 4;
            case 4:
                mixpanel_1.default.track('Send Auth Email', {
                    // @ts-ignore
                    distinct_id: user.email,
                });
                if (!(user.authTimesTried === auth_1.default.tryLimits)) return [3 /*break*/, 7];
                intervalFromLastTry = new Date().getTime() - user.lastAuthTry.getTime();
                if (!(intervalFromLastTry < auth_1.default.tryInterval)) return [3 /*break*/, 5];
                return [2 /*return*/, res.status(400).send({
                        title: 'Erro de Autenticação',
                        message: 'Você excedeu o limite de tentativas - Tente novamente mais tarde',
                    })];
            case 5: return [4 /*yield*/, db_1.default.user.update({ where: { id: user.id }, data: { authTimesTried: 0 } })];
            case 6:
                _a.sent();
                _a.label = 7;
            case 7:
                authCode = String(Math.floor(100000 + Math.random() * 900000));
                return [4 /*yield*/, db_1.default.user_auth.deleteMany({ where: { userId: user.id } })];
            case 8:
                _a.sent();
                return [4 /*yield*/, db_1.default.user_auth.create({ data: { userId: user.id, authCode: authCode } })];
            case 9:
                _a.sent();
                if (!(email !== 'yfaria@usp.br')) return [3 /*break*/, 11];
                return [4 /*yield*/, (0, sendEmail_1.sendEmail)(email, authCode)];
            case 10:
                _a.sent();
                _a.label = 11;
            case 11: return [2 /*return*/, res.send({ userId: user.id })];
            case 12:
                error_1 = _a.sent();
                console.error("[ERROR] [Send Auth Email] Unexpected Auth Error: ".concat(error_1.message));
                res.status(500).send({
                    title: 'Erro de Autenticação',
                    message: 'Erro inesperado ao enviar erro de verificação - Tente novamente depois',
                });
                return [3 /*break*/, 13];
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.sendAuthEmail = sendAuthEmail;
