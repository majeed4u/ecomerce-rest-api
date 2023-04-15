"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundErrorHandler = exports.globalErrorHandler = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        status: 'error',
        statusCode,
        message,
    });
};
exports.globalErrorHandler = globalErrorHandler;
const notFoundErrorHandler = (req, res, next) => {
    next((0, http_errors_1.default)(404, 'Not Found'));
};
exports.notFoundErrorHandler = notFoundErrorHandler;
