"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendRefreshToken = exports.sendAccessToken = exports.createRefreshToken = exports.createAccessToken = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var createAccessToken = function (userid) {
    return (0, jsonwebtoken_1.sign)({ userid: userid }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '5s'
    });
};
exports.createAccessToken = createAccessToken;
var createRefreshToken = function (userid) {
    return (0, jsonwebtoken_1.sign)({ userid: userid }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: '7d'
    });
};
exports.createRefreshToken = createRefreshToken;
var sendAccessToken = function (res, req, accesstoken) {
    return res.json({
        accesstoken: accesstoken,
        username: req.body.username
    });
};
exports.sendAccessToken = sendAccessToken;
var sendRefreshToken = function (res, refreshToken) {
    return res.cookie('refreshtoken', refreshToken, {
        httpOnly: true,
        path: '/refresh_token'
    });
};
exports.sendRefreshToken = sendRefreshToken;
