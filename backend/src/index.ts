import express from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());

if (!process.env.PORT) {
  console.warn("PORT not defined in .env. Defaulting to 8080.");
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
