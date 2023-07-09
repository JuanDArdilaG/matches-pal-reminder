"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const script_1 = require("./script");
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)({
    frameguard: false,
    // Aquí se muestra un ejemplo de ser un usuario de Chrome en Windows 10
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'"],
            "style-src": ["'self'", "'unsafe-inline'"],
            "img-src": ["'self'", "data:", "https://example.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
            "connect-src": ["'self'", "https://api.example.com"],
            "object-src": ["'none'"],
            "base-uri": ["'self'"],
            "form-action": ["'self'"],
            "frame-ancestors": ["'none'"],
            "worker-src": ["'self'"],
            "upgrade-insecure-requests": [],
            "block-all-mixed-content": [],
        },
    },
}));
app.post("/run-script", async (_, res) => {
    try {
        await (0, script_1.run)();
        res.send("script executed");
    }
    catch (error) {
        console.log(error);
        res.status(500).send("error");
    }
});
let port = process.env.PORT;
if (port == null || port == "") {
    port = "8000";
}
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
