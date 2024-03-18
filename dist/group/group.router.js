"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var group_controller_1 = __importDefault(require("./group.controller"));
var auth_1 = __importDefault(require("../middleware/auth"));
var router = express_1.default.Router();
router.route('/').all(auth_1.default).get(group_controller_1.default.getGroupsByCampusAndTags);
router.route('/:id').all(auth_1.default).get(group_controller_1.default.getGroup);
router.route('/').all(auth_1.default).post(group_controller_1.default.createGroup);
router.route('/:id').all(auth_1.default).delete(group_controller_1.default.deleteGroup);
exports.default = router;
