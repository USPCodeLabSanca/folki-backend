"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createActivity_1 = require("./controllers/createActivity");
var getAllActivities_1 = require("./controllers/getAllActivities");
var updateActivity_1 = require("./controllers/updateActivity");
var deleteActivity_1 = require("./controllers/deleteActivity");
var controller = {
    getAllActivities: getAllActivities_1.getAllActivities,
    createActivity: createActivity_1.createActivity,
    updateActivity: updateActivity_1.updateActivity,
    deleteActivity: deleteActivity_1.deleteActivity,
};
exports.default = controller;
