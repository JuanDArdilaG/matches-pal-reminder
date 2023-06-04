import express from "express";
import { run } from "./script";
import helmet from "helmet";

const app = express();
app.use(
  helmet({
    frameguard: false,
    // Configuración personalizada para simular ser un humano
    // Establecer el User-Agent para simular un navegador web
    // Puedes cambiar el valor a cualquier User-Agent válido
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
    // Configuración adicional según tus necesidades
  })
);

app.post("/run-script", async (req, res) => {
  await run();
  res.send("Script started");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = "8000";
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
