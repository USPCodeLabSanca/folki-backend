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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = __importDefault(require("../../db"));
var mixpanel_1 = __importDefault(require("../../utils/mixpanel"));
var updateMeSubjects = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, body, subjectClassIds, subjectClasses, userSubjects, subjectsIds_1, userSubjectsIds_1, subjectsClassRemoved, subjectsClassRemovedIds, subjectClassesToCreate, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user, body = req.body;
                subjectClassIds = body.subjectClassIds;
                if (!subjectClassIds)
                    return [2 /*return*/, res.status(400).send({ title: 'Disciplinas inválidas', message: 'Por favor, insira disciplinas válidas' })];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, db_1.default.subject_class.findMany({ where: { id: { in: subjectClassIds } } })];
            case 2:
                subjectClasses = _a.sent();
                if (subjectClasses.length !== subjectClassIds.length)
                    return [2 /*return*/, res.status(400).send({ title: 'Disciplinas inválidas', message: 'Por favor, insira disciplinas válidas' })];
                return [4 /*yield*/, db_1.default.user_subject.findMany({ where: { userId: user.id } })];
            case 3:
                userSubjects = _a.sent();
                subjectsIds_1 = subjectClasses.map(function (subjectClass) { return subjectClass.subjectId; });
                userSubjectsIds_1 = userSubjects.map(function (userSubject) { return userSubject.subjectId; });
                subjectsClassRemoved = userSubjects.filter(function (userSubject) { return !subjectsIds_1.includes(userSubject.subjectId); });
                subjectsClassRemovedIds = subjectsClassRemoved.map(function (subject) { return subject.subjectId; });
                subjectClassesToCreate = subjectClasses.filter(function (subjectClass) { return !userSubjectsIds_1.includes(subjectClass.subjectId); });
                console.log(subjectClassesToCreate);
                console.log(subjectsClassRemovedIds);
                return [4 /*yield*/, db_1.default.$transaction(__spreadArray([
                        db_1.default.user_absence.deleteMany({ where: { userId: user.id, subjectId: { in: subjectsClassRemovedIds } } }),
                        db_1.default.activity.deleteMany({ where: { userId: user.id, subjectId: { in: subjectsClassRemovedIds } } }),
                        db_1.default.user_subject.deleteMany({ where: { userId: user.id, subjectId: { in: subjectsClassRemovedIds } } })
                    ], subjectClassesToCreate.map(function (subjectClass) {
                        return db_1.default.user_subject.create({
                            data: { userId: user.id, subjectId: subjectClass.subjectId, availableDays: subjectClass.availableDays },
                        });
                    }), true))];
            case 4:
                _a.sent();
                mixpanel_1.default.track('Update User Subjects', {
                    // @ts-ignore
                    distinct_id: req.user.email,
                });
                res.send({ succesful: true });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _a.sent();
                console.error("[ERROR] [User Update Me Subjects] Unexpected User Subjects Update: ".concat(error_1.message));
                res.status(500).send({
                    title: 'Erro Inesperado',
                    message: 'Erro inesperado ao atualizar disciplinas do usuário - Tente novamente mais tarde',
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.default = updateMeSubjects;
