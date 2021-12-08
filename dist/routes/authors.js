"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var books_controller_1 = require("../controller/books.controller");
var router = express_1.default.Router();
router.get('/', books_controller_1.getAllAuthors);
router.get('/:id', books_controller_1.getAuthor);
router.post('/', books_controller_1.postAuthors);
router.put('/:id', books_controller_1.updateAuthor);
router.delete('/:id', books_controller_1.deleteAuthor);
router.post('/:id', books_controller_1.postBook);
router.delete('/:id/:bookId', books_controller_1.deleteBook);
router.get('/:id/:bookId', books_controller_1.getABook);
exports.default = router;
