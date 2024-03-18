"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var post_1 = require("./controllers/post");
var getAllFromSubject_1 = require("./controllers/getAllFromSubject");
var deleteAbsence_1 = require("./controllers/deleteAbsence");
var controller = {
    getAllFromSubject: getAllFromSubject_1.getAllFromSubject,
    post: post_1.post,
    deleteAbsence: deleteAbsence_1.deleteAbsence,
};
exports.default = controller;
