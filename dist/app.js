"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var http_errors_1 = __importDefault(require("http-errors"));
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var morgan_1 = __importDefault(require("morgan"));
var authors_1 = __importDefault(require("./routes/authors"));
var cors_1 = __importDefault(require("cors"));
var bcryptjs_1 = require("bcryptjs");
var jsonwebtoken_1 = require("jsonwebtoken");
require("dotenv/config");
var utils_1 = require("./utils/utils");
var uuid_1 = require("uuid");
var token_1 = require("./token");
var isAuth_1 = require("./isAuth");
var index_1 = __importDefault(require("./routes/index"));
var users_1 = __importDefault(require("./routes/users"));
exports.app = (0, express_1.default)();
// view engine setup
exports.app.set('views', path_1.default.join(__dirname, '../views'));
exports.app.set('view engine', 'jade');
exports.app.use((0, cors_1.default)());
exports.app.use((0, morgan_1.default)('dev'));
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: true }));
exports.app.use((0, cookie_parser_1.default)());
exports.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
exports.app.use('/', index_1.default);
exports.app.use('/users', users_1.default);
exports.app.use('/authors', authors_1.default);
// register enpoint needs refactoring!!!
exports.app.post('/register', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, data, user, hashedpassword, newUser, err_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, req.body];
            case 1:
                _a = _b.sent(), username = _a.username, password = _a.password;
                _b.label = 2;
            case 2:
                _b.trys.push([2, 4, , 5]);
                data = (0, utils_1.readDB)();
                user = data.find(function (users) { return users.username === username; });
                if (user)
                    throw new Error('Username already exist ');
                return [4 /*yield*/, (0, bcryptjs_1.hash)(password, 10)];
            case 3:
                hashedpassword = _b.sent();
                newUser = {
                    id: (0, uuid_1.v4)(),
                    username: username,
                    password: hashedpassword
                };
                data.push(newUser);
                (0, utils_1.writeDB)(data);
                res.status(201).json({ message: 'Signed up  successfully' });
                console.log(newUser);
                return [3 /*break*/, 5];
            case 4:
                err_1 = _b.sent();
                res.status(400).json({ error: "".concat(err_1.message) });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports.app.post("/login", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, data, user, userIndex, valid, accessToken, refreshToken, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                data = (0, utils_1.readDB)();
                user = data.find(function (users) { return users.username === username; });
                userIndex = data.findIndex(function (users) { return users.username === username; });
                if (!user)
                    res.status(401).json({ message: 'username does not exist' });
                return [4 /*yield*/, (0, bcryptjs_1.compare)(password, user.password)];
            case 2:
                valid = _b.sent();
                if (!valid)
                    res.status(401).json({ message: 'incorrect password' });
                accessToken = (0, token_1.createAccessToken)(user.id);
                refreshToken = (0, token_1.createRefreshToken)(user.id);
                user.refreshToken = refreshToken;
                data.splice(userIndex, 1, user);
                (0, utils_1.writeDB)(data);
                console.log(data);
                (0, token_1.sendRefreshToken)(res, refreshToken);
                (0, token_1.sendAccessToken)(res, req, accessToken);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                res.status(500).json({ error: "".concat(err_2.message) });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.app.post('/logout', function (_req, res, _next) {
    res.clearCookie('refreshtoken', { path: '/refresh_token' });
    return res.status(200).json({ message: 'logged out successfully' });
});
exports.app.get('/protected', function (req, res, _next) { return __awaiter(void 0, void 0, void 0, function () {
    var userid;
    return __generator(this, function (_a) {
        try {
            userid = (0, isAuth_1.isAuth)(req);
            if (userid !== null) {
                res.send({
                    data: 'This is protected data '
                });
            }
        }
        catch (err) {
            res.send({
                error: "".concat(err.message)
            });
        }
        return [2 /*return*/];
    });
}); });
exports.app.post('/refresh_token', function (req, res, _next) {
    var token = req.cookies.refreshtoken;
    var data = (0, utils_1.readDB)();
    if (!token)
        return res.send({ accessToken: '' });
    var payload;
    try {
        payload = (0, jsonwebtoken_1.verify)(token, process.env.REFRESH_TOKEN_SECRET);
    }
    catch (err) {
        return res.send({ accessToken: ' ' });
    }
    var user = data.find(function (users) { return users.id === payload.userid; });
    if (!user)
        return res.send({ accessToken: ' ' });
    if (user.refreshToken !== token) {
        res.send({ accessToken: ' ' });
    }
    var accessToken = (0, token_1.createAccessToken)(user.id);
    var refreshToken = (0, token_1.createRefreshToken)(user.id);
    user.refreshToken = refreshToken;
    (0, token_1.sendRefreshToken)(res, refreshToken);
    return res.send({ accessToken: accessToken });
});
// catch 404 and forward to error handler
exports.app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
exports.app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
exports.default = exports.app;
