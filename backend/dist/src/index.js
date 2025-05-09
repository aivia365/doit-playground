"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 8080;
const __dirname = path_1.default.resolve();
const app = (0, express_1.default)();
app.use((0, cookie_parser_1.default)()); // for parsing cookies
app.use(express_1.default.json()); // for parsing application/json
if (process.env.NODE_ENV !== "development") {
    app.use(express_1.default.static(path_1.default.join(__dirname, "/frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "frontend", "dist", "index.html"));
    });
}
app.listen(PORT, () => {
    console.log("Server is running on port " + PORT);
});
