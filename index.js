import { config } from "dotenv";
config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./db/db.js";
import MovieRoutes from "./routes/MovieRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/movies", MovieRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
