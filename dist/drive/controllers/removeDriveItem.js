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
exports.removeDriveItem = void 0;
var db_1 = __importDefault(require("../../db"));
var removeDriveItem = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, params, id, driveItem, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user, params = req.params;
                id = params.id;
                if (!(user === null || user === void 0 ? void 0 : user.isAdmin))
                    return [2 /*return*/, res
                            .status(401)
                            .send({ title: 'Não autorizado', message: 'Você não tem permissão para deletar itens do drive' })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, db_1.default.drive_item.findUnique({ where: { id: Number(id) } })];
            case 2:
                driveItem = _a.sent();
                if (!driveItem)
                    return [2 /*return*/, res.status(404).send({ title: 'Item não encontrado', message: 'Item não encontrado' })];
                if (!driveItem.approved) return [3 /*break*/, 4];
                return [4 /*yield*/, db_1.default.$transaction([
                        db_1.default.drive_item.delete({
                            where: { id: Number(id) },
                        }),
                        db_1.default.subject.update({
                            where: { id: Number(driveItem.subjectId) },
                            data: { driveItemsNumber: { decrement: 1 } },
                        }),
                    ])];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4: return [4 /*yield*/, db_1.default.drive_item.delete({
                    where: { id: Number(id) },
                })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                res.send({ succesful: true });
                return [3 /*break*/, 8];
            case 7:
                error_1 = _a.sent();
                console.error("[ERROR] [Delete Drive Item] Unexpected Error: ".concat(error_1.message));
                res.status(500).send({
                    title: 'Erro inesperado',
                    message: 'Erro inesperado ao deletar item do drive - Tente novamente mais tarde',
                });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.removeDriveItem = removeDriveItem;
