"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sendAuthEmail_1 = require("./controllers/sendAuthEmail");
var validateAuthCode_1 = require("./controllers/validateAuthCode");
var controller = {
    sendAuthEmail: sendAuthEmail_1.sendAuthEmail,
    validateAuthCode: validateAuthCode_1.validateAuthCode,
};
exports.default = controller;
