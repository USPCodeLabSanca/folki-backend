"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var campus_controller_1 = __importDefault(require("./campus.controller"));
var router = express_1.default.Router();
router.route('/').get(campus_controller_1.default.get);
router.route('/:id/institutes').get(campus_controller_1.default.getCampusInstitutes);
exports.default = router;
