"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var user_controller_1 = __importDefault(require("./user.controller"));
var auth_1 = __importDefault(require("../middleware/auth"));
var router = express_1.default.Router();
router.route('/cool-numbers').get(user_controller_1.default.getCoolNumbers);
router.route('/').all(auth_1.default).get(user_controller_1.default.getUsers);
router.route('/notifications').all(auth_1.default).post(user_controller_1.default.sendUserNotifications);
router.route('/me').all(auth_1.default).get(user_controller_1.default.getMe);
router.route('/me/subjects').all(auth_1.default).get(user_controller_1.default.getMeSubjects);
router.route('/me').all(auth_1.default).patch(user_controller_1.default.updateMe);
router.route('/me/subjects').all(auth_1.default).patch(user_controller_1.default.updateMeSubjects);
exports.default = router;
