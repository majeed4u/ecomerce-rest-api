"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = void 0;
const getToken = (req) => {
    var _a, _b;
    const token = (_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
    if (token === undefined) {
        return 'No token found in the header';
    }
    else {
        return token;
    }
};
exports.getToken = getToken;
