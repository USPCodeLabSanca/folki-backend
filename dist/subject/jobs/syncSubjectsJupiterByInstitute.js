"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var cheerio = __importStar(require("cheerio"));
var db_1 = __importDefault(require("../../db"));
var redis_1 = __importDefault(require("../../settings/redis"));
var bullmq_1 = require("bullmq");
var getJupiterDepartmentCodes = function (jupiterCode) { return __awaiter(void 0, void 0, void 0, function () {
    var departmentCodesJupiterLink, response, buffer, decoder, html, $, tbody, trs, departments;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                departmentCodesJupiterLink = "https://uspdigital.usp.br/jupiterweb/jupDepartamentoLista?codcg=".concat(jupiterCode, "&tipo=D");
                return [4 /*yield*/, fetch(departmentCodesJupiterLink)];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.arrayBuffer()];
            case 2:
                buffer = _a.sent();
                decoder = new TextDecoder('iso-8859-1');
                html = decoder.decode(buffer);
                $ = cheerio.load(html, { decodeEntities: false });
                tbody = $('tbody')[3];
                trs = $(tbody).children('tr');
                departments = trs.get().map(function (tr) {
                    var tds = tr.children;
                    var code = $(tds[1]).text().trim();
                    return code;
                });
                departments.shift();
                return [2 /*return*/, departments];
        }
    });
}); };
var getJupiterSubjects = function (jupiterCode) { return __awaiter(void 0, void 0, void 0, function () {
    var allSubjects, departmentCodes, _loop_1, i, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                allSubjects = [];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, getJupiterDepartmentCodes(jupiterCode)];
            case 2:
                departmentCodes = _a.sent();
                _loop_1 = function (i) {
                    var departmentCode, subjectsJupiterLink, response, buffer, decoder, html, $, tbody, trs, subjects;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                departmentCode = departmentCodes[i];
                                subjectsJupiterLink = "https://uspdigital.usp.br/jupiterweb/jupDisciplinaLista?codcg=".concat(jupiterCode, "&pfxdisval=").concat(departmentCode, "&tipo=D");
                                return [4 /*yield*/, fetch(subjectsJupiterLink)];
                            case 1:
                                response = _b.sent();
                                return [4 /*yield*/, response.arrayBuffer()];
                            case 2:
                                buffer = _b.sent();
                                decoder = new TextDecoder('iso-8859-1');
                                html = decoder.decode(buffer);
                                $ = cheerio.load(html, { decodeEntities: false });
                                tbody = $('tbody')[1];
                                trs = $(tbody).children('tr');
                                subjects = trs.get().map(function (tr) {
                                    var tds = tr.children;
                                    var code = $(tds[1]).text().trim();
                                    var name = $(tds[3]).text().trim();
                                    return { code: code, name: name };
                                });
                                subjects.shift();
                                allSubjects = allSubjects.concat(subjects);
                                return [2 /*return*/];
                        }
                    });
                };
                i = 0;
                _a.label = 3;
            case 3:
                if (!(i < departmentCodes.length)) return [3 /*break*/, 6];
                return [5 /*yield**/, _loop_1(i)];
            case 4:
                _a.sent();
                _a.label = 5;
            case 5:
                i++;
                return [3 /*break*/, 3];
            case 6: return [2 /*return*/, allSubjects];
            case 7:
                error_1 = _a.sent();
                throw error_1;
            case 8: return [2 /*return*/];
        }
    });
}); };
var getSubjectsToSync = function (subjectsFromInstitutes, subjectsFromJupiter, instituteId) {
    var subjectsDidntSync = subjectsFromJupiter.filter(function (subjectFromJupiter) {
        return !subjectsFromInstitutes.find(function (subjectFromInstitute) { return subjectFromInstitute.code === subjectFromJupiter.code; });
    });
    var subjectsToSync = subjectsDidntSync.map(function (subject) {
        return {
            code: subject.code,
            name: subject.name,
            instituteId: instituteId,
        };
    });
    return subjectsToSync;
};
var syncSubjectsJupiterWorker = function () {
    new bullmq_1.Worker('SyncSubjectsJupiter', function (job) { return __awaiter(void 0, void 0, void 0, function () {
        var instituteId, institute, subjectsFromInstitute, subjectsFromJupiter, subjectsToSync, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    instituteId = job.data.instituteId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, db_1.default.institute.findUnique({ where: { id: instituteId } })];
                case 2:
                    institute = _a.sent();
                    if (!institute)
                        throw new Error('institute not found');
                    if (!institute.jupiterCode)
                        throw new Error('institute has no jupiter code');
                    console.log("Syncing subjects from jupiter web of institute - ".concat(institute.name));
                    return [4 /*yield*/, db_1.default.subject.findMany({ where: { instituteId: instituteId } })];
                case 3:
                    subjectsFromInstitute = _a.sent();
                    return [4 /*yield*/, getJupiterSubjects(institute.jupiterCode)];
                case 4:
                    subjectsFromJupiter = _a.sent();
                    subjectsToSync = getSubjectsToSync(subjectsFromInstitute, subjectsFromJupiter, instituteId);
                    return [4 /*yield*/, db_1.default.subject.createMany({ data: subjectsToSync })];
                case 5:
                    _a.sent();
                    console.log("".concat(subjectsToSync.length, " subjects synced from jupiter web - ").concat(institute.name));
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    throw error_2;
                case 7: return [2 /*return*/];
            }
        });
    }); }, {
        connection: {
            host: redis_1.default.redisHost,
            port: redis_1.default.redisPort,
        },
    });
};
exports.default = syncSubjectsJupiterWorker;
