"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_controller_1 = __importDefault(require("./auth.controller"));
var router = express_1.default.Router();
router.route('/email').post(auth_controller_1.default.sendAuthEmail);
router.route('/verify').post(auth_controller_1.default.validateAuthCode);
exports.default = router;
