"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redisUrl = process.env.REDIS_URL;
var redisHost = process.env.REDIS_HOST;
var redisPort = Number(process.env.REDIS_PORT);
var redisSettings = {
    redisUrl: redisUrl,
    redisHost: redisHost,
    redisPort: redisPort,
};
exports.default = redisSettings;
