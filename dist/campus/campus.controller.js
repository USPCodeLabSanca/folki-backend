"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getAllCampuses_1 = require("./controllers/getAllCampuses");
var getCampusInstitutes_1 = require("./controllers/getCampusInstitutes");
var controller = {
    get: getAllCampuses_1.getAllCampuses,
    getCampusInstitutes: getCampusInstitutes_1.getCampusInstitutes,
};
exports.default = controller;
