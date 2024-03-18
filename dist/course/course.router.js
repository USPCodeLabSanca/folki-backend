"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var course_controller_1 = __importDefault(require("./course.controller"));
var router = express_1.default.Router();
router.route('/:id/defaultSubjects').get(course_controller_1.default.getCourseDefaultSubjects);
exports.default = router;
