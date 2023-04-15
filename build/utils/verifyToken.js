"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const enValidator_1 = __importDefault(require("./enValidator"));
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, enValidator_1.default.JWT_SECRET, (err, decoded) => {
        if (err) {
            return false;
        }
        else {
            return decoded;
        }
    });
};
exports.verifyToken = verifyToken;
