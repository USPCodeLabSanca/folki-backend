"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Mixpanel = require('mixpanel');
var mixpanel = Mixpanel.init(process.env.MIXPANEL_TOKEN);
exports.default = mixpanel;
