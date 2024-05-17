import { Router } from "express";
import {
  getMovies,
  addMovie,
  getLatestMovies,
} from "../controllers/MoviesController.js";

const router = Router();

router.get("/", getMovies);

router.post("/", addMovie);

router.get("/latest-movies", getLatestMovies);

export default router;
