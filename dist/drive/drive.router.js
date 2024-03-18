"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = __importDefault(require("../middleware/auth"));
var drive_controller_1 = __importDefault(require("./drive.controller"));
var router = express_1.default.Router();
router.route('/').all(auth_1.default).post(drive_controller_1.default.addDriveItem);
router.route('/:id').all(auth_1.default).delete(drive_controller_1.default.removeDriveItem);
exports.default = router;
