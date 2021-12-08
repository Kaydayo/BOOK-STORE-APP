"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
var jsonwebtoken_1 = require("jsonwebtoken");
var isAuth = function (req) {
    var authorization = req.headers['authorization'];
    if (!authorization)
        throw new Error("you need to login");
    var token = authorization.split(' ')[1];
    var userid = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_SECRET);
    return userid;
};
exports.isAuth = isAuth;
