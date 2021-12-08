"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeDB = exports.readDB = exports.writeFile = exports.generateIdsForBooks = exports.readFile = exports.validateEntry = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var joi_1 = __importDefault(require("joi"));
var validateEntry = function (data) {
    var schema = joi_1.default.object({
        author: joi_1.default.string().required(),
        age: joi_1.default.number().required(),
        address: joi_1.default.string().required(),
        books: joi_1.default.array().required()
    }).unknown();
    return schema.validate(data);
};
exports.validateEntry = validateEntry;
var filepath = path_1.default.join(__dirname, "../database.json");
var filepath2 = path_1.default.join(__dirname, "../userDB.json");
function readFile() {
    try {
        var data = fs_1.default.readFileSync(filepath, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        return [];
    }
}
exports.readFile = readFile;
function generateIdsForBooks(booksData) {
    return booksData.map(function (book, idx) {
        return __assign({ id: "book".concat(idx + 1) }, book);
    });
}
exports.generateIdsForBooks = generateIdsForBooks;
var writeFile = function (data) {
    fs_1.default.writeFileSync(filepath, JSON.stringify(data, null, 4));
};
exports.writeFile = writeFile;
function readDB() {
    try {
        var data = fs_1.default.readFileSync(filepath2, "utf8");
        return JSON.parse(data);
    }
    catch (error) {
        return [];
    }
}
exports.readDB = readDB;
var writeDB = function (data) {
    fs_1.default.writeFileSync(filepath2, JSON.stringify(data, null, 4));
};
exports.writeDB = writeDB;
