import express from "express";
import { run } from "./script";
import helmet from "helmet";

const app = express();
app.use(
  helmet({
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
  })
);

app.post("/run-script", async (_, res) => {
  try {
    await run();
    res.send("script executed");
  } catch (error) {
    console.log(error);
    res.status(500).send("error");
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = "8008";
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
