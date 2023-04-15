"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app/app"));
const http_1 = __importDefault(require("http"));
const enValidator_1 = __importDefault(require("./utils/enValidator"));
// create server
const server = http_1.default.createServer(app_1.default);
const PORT = enValidator_1.default.PORT;
server.listen(PORT, () => console.log(`Server is running at ${PORT}`));
