"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const enValidator_1 = __importDefault(require("./enValidator"));
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, enValidator_1.default.JWT_SECRET, { expiresIn: enValidator_1.default.JWT_LIFE });
};
exports.default = generateToken;
