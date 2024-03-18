"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var subject_controller_1 = __importDefault(require("./subject.controller"));
var absence_controller_1 = __importDefault(require("../absence/absence.controller"));
var drive_controller_1 = __importDefault(require("../drive/drive.controller"));
var auth_1 = __importDefault(require("../middleware/auth"));
var router = express_1.default.Router();
router.route('/').get(subject_controller_1.default.getSubjects);
router.route('/sync').post(subject_controller_1.default.runSyncSubjectsJupiterByInstitute);
router.route('/default/sync').post(subject_controller_1.default.runSyncDefaultSubjectsJupiterByCourse);
router.route('/classes/sync').post(subject_controller_1.default.runSyncClassesJupiterBySubject);
router.route('/:id/absences').all(auth_1.default).get(absence_controller_1.default.getAllFromSubject);
router.route('/:id/absences').all(auth_1.default).post(absence_controller_1.default.post);
router.route('/:id/drive').all(auth_1.default).get(drive_controller_1.default.getDriveItems);
exports.default = router;
