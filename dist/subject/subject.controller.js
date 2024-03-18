"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getSubjects_1 = require("./controllers/getSubjects");
var runSyncSubjectsJupiterByInstitute_1 = require("./controllers/runSyncSubjectsJupiterByInstitute");
var runSyncDefaultSubjectsJupiterByCourse_1 = require("./controllers/runSyncDefaultSubjectsJupiterByCourse");
var runSyncClassesJupiterBySubject_1 = require("./controllers/runSyncClassesJupiterBySubject");
var controller = {
    getSubjects: getSubjects_1.getSubjects,
    runSyncSubjectsJupiterByInstitute: runSyncSubjectsJupiterByInstitute_1.runSyncSubjectsJupiterByInstitute,
    runSyncDefaultSubjectsJupiterByCourse: runSyncDefaultSubjectsJupiterByCourse_1.runSyncDefaultSubjectsJupiterByCourse,
    runSyncClassesJupiterBySubject: runSyncClassesJupiterBySubject_1.runSyncClassesJupiterBySubject,
};
exports.default = controller;
