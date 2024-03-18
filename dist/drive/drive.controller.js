"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var getDriveItems_1 = require("./controllers/getDriveItems");
var addDriveItem_1 = require("./controllers/addDriveItem");
var removeDriveItem_1 = require("./controllers/removeDriveItem");
var controller = {
    addDriveItem: addDriveItem_1.addDriveItem,
    getDriveItems: getDriveItems_1.getDriveItems,
    removeDriveItem: removeDriveItem_1.removeDriveItem,
};
exports.default = controller;
