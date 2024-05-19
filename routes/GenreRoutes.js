import { Router } from "express";
import { getGenres } from "../controllers/GenreController.js";

const router = Router();

router.get("/", getGenres);

export default router;
