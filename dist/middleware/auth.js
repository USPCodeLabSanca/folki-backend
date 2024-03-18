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
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var db_1 = __importDefault(require("../db"));
var auth = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authHeader, parts, scheme, token, tokenData, user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authHeader = req.headers.authorization;
                if (!authHeader) {
                    return [2 /*return*/, res.status(401).send({ title: 'Erro de Autorização', message: 'Header de Autorização não existe' })];
                }
                parts = authHeader.split(' ');
                if (!(parts.length === 2)) {
                    return [2 /*return*/, res.status(401).send({ title: 'Erro de Autorização', message: 'Header de Autorização mal formatado' })];
                }
                scheme = parts[0], token = parts[1];
                if (!/^Bearer$/i.test(scheme)) {
                    return [2 /*return*/, res.status(401).send({ title: 'Erro de Autorização', message: 'Header de Autorização mal formatado' })];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                tokenData = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
                return [4 /*yield*/, db_1.default.user.findUnique({
                        where: { id: tokenData.id },
                        select: {
                            email: true,
                            id: true,
                            name: true,
                            securePin: true,
                            isAdmin: true,
                            instituteId: true,
                            courseId: true,
                            institute: true,
                        },
                    })];
            case 2:
                user = _a.sent();
                if (!user)
                    return [2 /*return*/, res.status(401).send({ title: 'Erro de Autorização', message: 'Usuário não Existe' })];
                if (user.securePin !== tokenData.securePin)
                    return [2 /*return*/, res.status(401).send({ title: 'Erro de Autorização', message: 'Usuário Impedido de Fazer Login' })
                        // @ts-ignore
                    ];
                // @ts-ignore
                delete user.securePin;
                // @ts-ignore
                req.user = user;
                next();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                /* istanbul ignore next */
                console.error("[ERROR] [Auth Middleware] Unexpected Auth Error: ".concat(err_1.message));
                /* istanbul ignore next */
                return [2 /*return*/, res
                        .status(500)
                        .send({ title: 'Erro de Autorização', message: 'Erro Inesperado de Autenticação - Tente Novamente mais Tarde' })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.default = auth;
