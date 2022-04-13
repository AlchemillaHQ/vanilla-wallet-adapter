"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Adapter_1 = __importDefault(require("./Adapter/Adapter"));
if (window) {
    window.SolanaAdapter = Adapter_1.default;
}
exports.default = Adapter_1.default;
//# sourceMappingURL=index.js.map