"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const script_1 = require("./script");
const app = (0, express_1.default)();
app.post("/run-script", async (req, res) => {
    await (0, script_1.run)();
    res.send("Script started");
});
let port = process.env.PORT;
if (port == null || port == "") {
    port = "8000";
}
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
