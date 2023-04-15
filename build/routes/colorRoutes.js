"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ColorCtrl = __importStar(require("../controller/colorCtrl"));
const isLoggedN_1 = require("../middlewares/isLoggedN");
const isAdmin_1 = __importDefault(require("../middlewares/isAdmin"));
const router = express_1.default.Router();
router.post('/', isLoggedN_1.isLoggedN, isAdmin_1.default, ColorCtrl.createColor);
router.get('/', ColorCtrl.getAllColors);
router.get('/:id', ColorCtrl.getSingleColor);
router.patch('/:id', isLoggedN_1.isLoggedN, isAdmin_1.default, ColorCtrl.updateColor);
router.delete('/:id', isLoggedN_1.isLoggedN, isAdmin_1.default, ColorCtrl.deleteColor);
exports.default = router;
