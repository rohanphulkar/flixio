import { Router } from "express";
import { getMovies, addMovie } from "../controllers/MoviesController.js";

const router = Router();

router.get("/", getMovies);

router.post("/", addMovie);

export default router;
