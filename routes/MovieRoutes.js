import { Router } from "express";
import {
  getMovies,
  addMovie,
  getLatestMovies,
  getMovie,
} from "../controllers/MoviesController.js";

const router = Router();

router.get("/", getMovies);

router.post("/", addMovie);

router.get("/latest-movies", getLatestMovies);

router.get("/search/:id", getMovie);

export default router;
