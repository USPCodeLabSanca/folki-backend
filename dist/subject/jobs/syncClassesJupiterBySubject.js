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
var bullmq_1 = require("bullmq");
var db_1 = __importDefault(require("../../db"));
var cheerio = __importStar(require("cheerio"));
var redis_1 = __importDefault(require("../../settings/redis"));
var weekdays = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab', 'dom'];
var getJupiterClasses = function (subjectCode) { return __awaiter(void 0, void 0, void 0, function () {
    var subjectsJupiterLink, myHeaders, response, buffer, decoder, html, $_1, isValid, classes_1, tbody, tbodies, isRegularClass, index_1, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                subjectsJupiterLink = "https://uspdigital.usp.br/jupiterweb/obterTurma?sgldis=".concat(subjectCode);
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
                isValid = $_1('p:contains("existe oferecimento para a sigla")');
                if (isValid.length)
                    return [2 /*return*/, []];
                classes_1 = [];
                tbody = $_1('tbody')[8];
                tbodies = $_1(tbody).find('tbody');
                isRegularClass = $_1(tbodies.get()[1]).find('tr').eq(0).find('td').eq(0).text().includes('Horário');
                if (!isRegularClass)
                    return [2 /*return*/, []];
                index_1 = -1;
                tbodies.get().forEach(function (tbod) {
                    if ($_1(tbod).text().includes('Observações:') && index_1 === -1)
                        index_1 = 0;
                    if (!index_1) {
                        classes_1.push({
                            details: $_1(tbod)
                                .find('tr')
                                .eq(4)
                                .text()
                                .replace(/\n/g, ' ')
                                .trim()
                                .replace(/\s\s+/g, ' ')
                                .replace('Observações:', '')
                                .trim(),
                        });
                        index_1 = 1;
                    }
                    else if (index_1 === 1) {
                        var availableDays_1 = [];
                        $_1(tbod)
                            .children('tr')
                            .get()
                            .forEach(function (tr, i) {
                            if (!i)
                                return;
                            classes_1[classes_1.length - 1].professorName = $_1(tr).find('td').eq(3).text().trim();
                            var day = $_1(tr).find('td').eq(0).text().trim();
                            availableDays_1.push({
                                day: day || availableDays_1[availableDays_1.length - 1].day,
                                start: $_1(tr).find('td').eq(1).text().trim(),
                                end: $_1(tr).find('td').eq(2).text().trim(),
                            });
                        });
                        classes_1[classes_1.length - 1].availableDays = availableDays_1;
                        index_1 = -1;
                    }
                });
                return [2 /*return*/, classes_1];
            case 3:
                error_1 = _a.sent();
                throw error_1;
            case 4: return [2 /*return*/];
        }
    });
}); };
var syncClassesJupiterBySubjectWorker = function () {
    new bullmq_1.Worker('SyncClassesJupiter', function (job) { return __awaiter(void 0, void 0, void 0, function () {
        var subjectId, subject, jupiterClasses, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    subjectId = job.data.subjectId;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    if (!subjectId)
                        throw new Error('subjectId not found');
                    return [4 /*yield*/, db_1.default.subject.findUnique({ where: { id: subjectId } })];
                case 2:
                    subject = _a.sent();
                    if (!subject)
                        throw new Error('subject not found');
                    if (!subject.code)
                        throw new Error('subject has no code');
                    console.log("Syncing classes from jupiter web of subject ".concat(subject.code, " ").concat(subject.name));
                    return [4 /*yield*/, getJupiterClasses(subject.code)];
                case 3:
                    jupiterClasses = _a.sent();
                    return [4 /*yield*/, db_1.default.$transaction([
                            db_1.default.subject_class.deleteMany({ where: { subjectId: subjectId } }),
                            db_1.default.subject_class.createMany({
                                data: jupiterClasses.map(function (jupiterClass) {
                                    return {
                                        details: jupiterClass.details,
                                        professorName: jupiterClass.professorName,
                                        subjectId: subjectId,
                                        availableDays: jupiterClass.availableDays,
                                    };
                                }),
                            }),
                        ])];
                case 4:
                    _a.sent();
                    console.log("".concat(jupiterClasses.length, " classes synced from jupiter web of subject ").concat(subject.code, " ").concat(subject.name));
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    throw error_2;
                case 6: return [2 /*return*/];
            }
        });
    }); }, {
        connection: {
            host: redis_1.default.redisHost,
            port: redis_1.default.redisPort,
        },
    });
};
exports.default = syncClassesJupiterBySubjectWorker;
