import express from "express";
import { run } from "./script";

const app = express();

app.post("/run-script", (req, res) => {
  run();
  res.send("Script started");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = "8000";
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
