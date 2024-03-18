"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var absence_controller_1 = __importDefault(require("./absence.controller"));
var auth_1 = __importDefault(require("../middleware/auth"));
var router = express_1.default.Router();
router.route('/:id').all(auth_1.default).delete(absence_controller_1.default.deleteAbsence);
exports.default = router;
