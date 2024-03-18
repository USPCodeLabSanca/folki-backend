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
var cheerio = __importStar(require("cheerio"));
var db_1 = __importDefault(require("../../db"));
var redis_1 = __importDefault(require("../../settings/redis"));
var bullmq_1 = require("bullmq");
var getJupiterDefaultSubjects = function (jupiterCode, jupiterCodeHab) { return __awaiter(void 0, void 0, void 0, function () {
    var subjectsJupiterLink, myHeaders, response, buffer, decoder, html, $_1, tbody, trs, periods_1, electiveStarted_1, started_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                subjectsJupiterLink = "https://uspdigital.usp.br/jupiterweb/listarGradeCurricular?codcg=86&codcur=".concat(jupiterCode, "&codhab=").concat(jupiterCodeHab, "&tipo=N");
                myHeaders = new Headers();
                myHeaders.append('Content-Type', 'text/plain; charset=ISO-8859-1');
                return [4 /*yield*/, fetch(subjectsJupiterLink, { headers: myHeaders })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.arrayBuffer()];
            case 2:
                buffer = _a.sent();
                decoder = new TextDecoder('iso-8859-1');
                html = decoder.decode(buffer);
                $_1 = cheerio.load(html, { decodeEntities: false });
                tbody = $_1('table tbody table tbody')[11];
                trs = $_1('tr');
                periods_1 = [];
                electiveStarted_1 = false;
                started_1 = false;
                trs.get().forEach(function (tr, index) {
                    var isTheFirstTr = index === 0;
                    if (!started_1) {
                        started_1 = tr.attribs.bgcolor === '#658CCF';
                    }
                    if (electiveStarted_1 || isTheFirstTr || !started_1)
                        return;
                    var isNewPeriod = tr.attribs.bgcolor === '#CCCCCC';
                    if (isNewPeriod) {
                        periods_1.push([]);
                        return;
                    }
                    var isSubject = tr.attribs.bgcolor === '#FFFFFF' && $_1(tr).find('a').get().length;
                    if (isSubject) {
                        var tds = tr.children;
                        var code = $_1(tds[1]).text().trim();
                        periods_1[periods_1.length - 1].push(code);
                    }
                    electiveStarted_1 = $_1(tr).text().trim().includes('Optativas');
                });
                return [2 /*return*/, periods_1];
            case 3:
                error_1 = _a.sent();
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
var getSubjectIdByCode = function (code, subjects) {
    var subject = subjects.find(function (subject) { return subject.code === code; });
    return subject.id;
};
var syncDefaultSubjectsJupiterWorker = function () {
    new bullmq_1.Worker('SyncDefaultSubjectsJupiter', function (job) { return __awaiter(void 0, void 0, void 0, function () {
        var courseId, course, jupiterDefaultSubjectCodesByPeriod, jupiterSubjects_1, isMissingSubjects, subjectsMissed, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    courseId = job.data.courseId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, db_1.default.course.findUnique({ where: { id: courseId } })];
                case 2:
                    course = _a.sent();
                    if (!course)
                        throw new Error('course not found');
                    if (!course.jupiterCode || !course.jupiterCodeHab)
                        throw new Error('institute has no jupiter code');
                    console.log("INFO: Syncing default subjects from jupiter web of course ".concat(course.name));
                    return [4 /*yield*/, getJupiterDefaultSubjects(course.jupiterCode, course.jupiterCodeHab)];
                case 3:
                    jupiterDefaultSubjectCodesByPeriod = _a.sent();
                    console.log("INFO: ".concat(jupiterDefaultSubjectCodesByPeriod.length, " periods found"));
                    return [4 /*yield*/, db_1.default.subject.findMany({
                            where: { code: { in: jupiterDefaultSubjectCodesByPeriod.flat() } },
                        })];
                case 4:
                    jupiterSubjects_1 = _a.sent();
                    isMissingSubjects = jupiterSubjects_1.length !== jupiterDefaultSubjectCodesByPeriod.flat().length;
                    if (isMissingSubjects) {
                        subjectsMissed = jupiterDefaultSubjectCodesByPeriod
                            .flat()
                            .filter(function (code) { return !jupiterSubjects_1.find(function (subject) { return subject.code === code; }); })
                            .join(', ');
                        throw new Error("missing subjects - ".concat(subjectsMissed));
                    }
                    return [4 /*yield*/, db_1.default.$transaction(__spreadArray([
                            db_1.default.default_subject.deleteMany({ where: { courseId: courseId } })
                        ], jupiterDefaultSubjectCodesByPeriod.map(function (period, index) {
                            return db_1.default.default_subject.createMany({
                                data: period.map(function (code) {
                                    return {
                                        period: index + 1,
                                        courseId: courseId,
                                        subjectId: getSubjectIdByCode(code, jupiterSubjects_1),
                                    };
                                }),
                            });
                        }), true))];
                case 5:
                    _a.sent();
                    console.log("INFO: ".concat(jupiterSubjects_1.length, " default subjects synced from jupiter web - ").concat(course.name, "\n"));
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    console.log("ERROR: Syncing default subjects from jupiter web of course ".concat(courseId, " failed\n"));
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
exports.default = syncDefaultSubjectsJupiterWorker;
