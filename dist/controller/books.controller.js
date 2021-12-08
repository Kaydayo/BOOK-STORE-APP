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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getABook = exports.deleteBook = exports.postBook = exports.deleteAuthor = exports.updateAuthor = exports.postAuthors = exports.getAuthor = exports.getAllAuthors = void 0;
var express_1 = __importDefault(require("express"));
var utils_1 = require("../utils/utils");
var utils_2 = require("../utils/utils");
var isAuth_1 = require("../isAuth");
var control = (0, express_1.default)();
var getAllAuthors = function (req, res, next) {
    try {
        var userid = (0, isAuth_1.isAuth)(req);
        if (userid !== null) {
            var data = (0, utils_1.readFile)();
            res.status(200).json({ message: "".concat(data.length, " authors retrieved successfully"), data: data });
        }
    }
    catch (err) {
        res.send({
            error: "".concat(err.message)
        });
    }
};
exports.getAllAuthors = getAllAuthors;
var getAuthor = function (req, res, next) {
    var data = (0, utils_1.readFile)();
    var authorData = data.find(function (item) { return "".concat(item.id) === req.params.id; });
    if (!authorData) {
        return res.status(404).json({ message: "author with the id ".concat(req.params.id, " cannot be found") });
    }
    res.status(200).json({ message: "author with id ".concat(req.params.id, " found"), data: authorData });
};
exports.getAuthor = getAuthor;
var postAuthors = function (req, res, next) {
    var error = (0, utils_2.validateEntry)(req.body).error;
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    else {
        var data = (0, utils_1.readFile)();
        var newAuthor = __assign(__assign({}, req.body), { books: (0, utils_2.generateIdsForBooks)(req.body.books) }); //dont understand
        var newData = __assign({ id: data.length + 1, dateRegistered: new Date().getTime() }, newAuthor);
        var allNewData = __spreadArray(__spreadArray([], data, true), [newData], false);
        (0, utils_1.writeFile)(allNewData);
        res.status(201).json({ message: "creates new Author", data: newData });
    }
};
exports.postAuthors = postAuthors;
var updateAuthor = function (req, res, _next) {
    var data = (0, utils_1.readFile)();
    var dataToUpdate = data.find(function (item) { return "".concat(item.id) === req.params.id; });
    if (!dataToUpdate) {
        return res.status(404).json({ message: "author with id: ".concat(req.params.id, " does not exist") });
    }
    var newData = __assign(__assign({}, dataToUpdate), req.body);
    var dataIndex = data.findIndex(function (item) { return "".concat(item.id) === req.params.id; });
    data.splice(dataIndex, 1, newData);
    (0, utils_1.writeFile)(data);
    res.status(201).json({ message: "author with id ".concat(req.params.id, " updated successfully"), data: newData });
};
exports.updateAuthor = updateAuthor;
var deleteAuthor = function (req, res, _next) {
    var data = (0, utils_1.readFile)();
    var foundAuthor = data.find(function (elem) { return "".concat(elem.id) === req.params.id; });
    if (!foundAuthor) {
        return res.status(404).json({ message: "author with id ".concat(req.params.id, " does not exist") });
    }
    var newAuthors = data.filter(function (item) { return "".concat(item.id) !== req.params.id; });
    (0, utils_1.writeFile)(newAuthors);
    res.status(201).json({ message: "author deleted successfully" });
};
exports.deleteAuthor = deleteAuthor;
var postBook = function (req, res, _next) {
    var data = (0, utils_1.readFile)();
    var authorFind = data.find((function (item) { return "".concat(item.id) === req.params.id; }));
    var authorIndex = data.findIndex((function (item) { return "".concat(item.id) === req.params.id; }));
    if (!authorFind) {
        return res.status(404).json({ message: "author does not exist" });
    }
    authorFind = __assign(__assign({}, authorFind), { books: __spreadArray(__spreadArray([], authorFind.books, true), [__assign({ id: "book".concat(authorFind.books.length + 1) }, req.body)], false) });
    var newData = data.splice(authorIndex, 1, authorFind);
    (0, utils_1.writeFile)(data);
    res.status(201).json({ message: "new book added", author: authorFind });
};
exports.postBook = postBook;
var deleteBook = function (req, res, next) {
    var data = (0, utils_1.readFile)();
    var authorFind = data.find(function (item) { return "".concat(item.id) === req.params.id; });
    if (!authorFind) {
        return res.status(404).json({ message: "author with the id ".concat(req.params.id, " does not exist") });
    }
    var bookToDelete = authorFind.books.find(function (item) {
        return "".concat(item.id) === req.params.bookId;
    });
    if (!bookToDelete) {
        return res.status(404).json({ message: "book with the id ".concat(req.params.bookId, " does not exist") });
    }
    var dataIndex = authorFind.books.findIndex(function (item) { return "".concat(item.id) === req.params.bookId; });
    authorFind.books.splice(dataIndex, 1);
    (0, utils_1.writeFile)(data);
    res.status(200).json({ message: "Book with the id ".concat(req.params.bookId, " has been trashed") });
};
exports.deleteBook = deleteBook;
var getABook = function (req, res, next) {
    var data = (0, utils_1.readFile)();
    var authorData = data.find(function (item) { return "".concat(item.id) === req.params.id; });
    if (!authorData) {
        return res.status(404).json({ message: "author with the id ".concat(req.params.authorId, " not found") });
    }
    var bookData = authorData.books.find(function (item) { return "".concat(item.id) === req.params.bookId; });
    if (!bookData) {
        return res.status(404).json({ message: "book with the id ".concat(req.params.bookId, " not found") });
    }
    res.status(200).json({ mesaage: "success", data: bookData });
};
exports.getABook = getABook;
