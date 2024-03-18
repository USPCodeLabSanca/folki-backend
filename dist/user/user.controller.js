"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var getMe_1 = __importDefault(require("./controllers/getMe"));
var updateMe_1 = __importDefault(require("./controllers/updateMe"));
var updateMeSubjects_1 = __importDefault(require("./controllers/updateMeSubjects"));
var getMeSubjects_1 = __importDefault(require("./controllers/getMeSubjects"));
var getCoolNumbers_1 = __importDefault(require("./controllers/getCoolNumbers"));
var getUsersByQuery_1 = __importDefault(require("./controllers/getUsersByQuery"));
var sendUserNotifications_1 = __importDefault(require("./controllers/sendUserNotifications"));
var controller = {
    getCoolNumbers: getCoolNumbers_1.default,
    getUsers: getUsersByQuery_1.default,
    sendUserNotifications: sendUserNotifications_1.default,
    getMe: getMe_1.default,
    getMeSubjects: getMeSubjects_1.default,
    updateMe: updateMe_1.default,
    updateMeSubjects: updateMeSubjects_1.default,
};
exports.default = controller;
