"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedN = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const getToken_1 = require("../utils/getToken");
const verifyToken_1 = require("../utils/verifyToken");
const isLoggedN = (req, res, next) => {
    const token = (0, getToken_1.getToken)(req);
    const decodedUser = (0, verifyToken_1.verifyToken)(token);
    if (!decodedUser) {
        throw (0, http_errors_1.default)(401, 'Invalid/Expires token');
    }
    else {
        req.userAuthId = decodedUser === null || decodedUser === void 0 ? void 0 : decodedUser.userId;
    }
    next();
};
exports.isLoggedN = isLoggedN;
