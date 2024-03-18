"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var createGroup_1 = require("./controllers/createGroup");
var deleteGroup_1 = require("./controllers/deleteGroup");
var getGroup_1 = require("./controllers/getGroup");
var getGroupsByCampusAndTags_1 = require("./controllers/getGroupsByCampusAndTags");
var controller = {
    getGroupsByCampusAndTags: getGroupsByCampusAndTags_1.getGroupsByCampusAndTags,
    getGroup: getGroup_1.getGroup,
    createGroup: createGroup_1.createGroup,
    deleteGroup: deleteGroup_1.deleteGroup,
};
exports.default = controller;
