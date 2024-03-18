"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var createToken = function (id, securePin) {
    var token = jsonwebtoken_1.default.sign({ id: id, securePin: securePin }, process.env.JWT_SECRET || 'secret');
    return token;
};
exports.default = createToken;
