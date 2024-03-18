"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var router_1 = __importDefault(require("./router"));
var jobs_1 = __importDefault(require("./jobs"));
var app = (0, express_1.default)();
var port = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: '*',
}));
app.use(express_1.default.json());
app.use('/api/', router_1.default);
(0, jobs_1.default)();
app.listen(port, function () {
    console.log("[server]: Server is running at http://localhost:".concat(port));
});
