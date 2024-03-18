"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var syncClassesJupiterBySubject_1 = __importDefault(require("../subject/jobs/syncClassesJupiterBySubject"));
var syncDefaultSubjectsJupiterByCourse_1 = __importDefault(require("../subject/jobs/syncDefaultSubjectsJupiterByCourse"));
var syncSubjectsJupiterByInstitute_1 = __importDefault(require("../subject/jobs/syncSubjectsJupiterByInstitute"));
var startJobs = function () {
    if (process.env.IS_REDIS_ON === 'true') {
        (0, syncSubjectsJupiterByInstitute_1.default)();
        (0, syncDefaultSubjectsJupiterByCourse_1.default)();
        (0, syncClassesJupiterBySubject_1.default)();
    }
};
exports.default = startJobs;
