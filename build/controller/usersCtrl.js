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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateShippingAddress = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const http_errors_1 = __importDefault(require("http-errors"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
exports.registerUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
        // throw an error
        throw (0, http_errors_1.default)(400, 'please provide all values');
    }
    const userExist = yield User_1.default.findOne({ email: email }).exec();
    if (userExist) {
        // throw error
        throw (0, http_errors_1.default)(409, 'User already exists');
    }
    // has password
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    // create new user
    const newUser = yield User_1.default.create({
        fullName: fullName,
        email: email,
        password: hashedPassword,
    });
    // toekn
    res.status(201).json({
        status: 'success',
        message: 'User created successfully',
        data: newUser,
    });
}));
exports.loginUser = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const userFound = yield User_1.default.findOne({ email: email }).exec();
    if (userFound && (yield bcrypt_1.default.compare(password, userFound.password))) {
        res.json({
            status: 'Success',
            msg: 'Login Success',
            userFound,
            token: (0, generateToken_1.default)(userFound._id),
        });
    }
    else {
        throw (0, http_errors_1.default)(401, 'Invalid credentials');
    }
}));
exports.getUserProfile = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.userAuthId).populate('orders');
    console.log(user);
    res.json({
        status: 'success',
        message: 'Profile fetched Successfully',
        user,
    });
}));
// updating shipping address
exports.updateShippingAddress = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, address, city, postalCode, country, province, phoneNumber, } = req.body;
    const user = yield User_1.default.findByIdAndUpdate(req.userAuthId, {
        hasShippingAddress: true,
        ShippingAddress: {
            firstName,
            lastName,
            address,
            city,
            postalCode,
            country,
            province,
            phoneNumber,
        },
    }, { new: true });
    console.log(user);
    if (!user) {
        throw (0, http_errors_1.default)(404, 'User not found');
    }
    else {
        yield user.save();
        res.json({
            status: 'success',
            message: 'Shipping address updated successfully',
            user: user,
        });
    }
}));
