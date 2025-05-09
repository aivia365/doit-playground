import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8080;
const __dirname = path.resolve();

const app = express();

app.use(cookieParser()); // for parsing cookies
app.use(express.json()); // for parsing application/json

if (process.env.NODE_ENV !== "development") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
