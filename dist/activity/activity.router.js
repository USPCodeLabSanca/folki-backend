"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var activity_controller_1 = __importDefault(require("./activity.controller"));
var auth_1 = __importDefault(require("../middleware/auth"));
var router = express_1.default.Router();
router.route('/').all(auth_1.default).get(activity_controller_1.default.getAllActivities);
router.route('/').all(auth_1.default).post(activity_controller_1.default.createActivity);
router.route('/:id').all(auth_1.default).patch(activity_controller_1.default.updateActivity);
router.route('/:id').all(auth_1.default).delete(activity_controller_1.default.deleteActivity);
exports.default = router;
