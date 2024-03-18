"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FIFTEEEN_MINUTES_IN_MS = 60 * 1000 * 15;
var authSettings = {
    tryLimits: 3,
    tryInterval: FIFTEEEN_MINUTES_IN_MS,
};
exports.default = authSettings;
