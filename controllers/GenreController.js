import { Genre } from "../models/Genre.js";

export const getGenres = async (req, res) => {
  try {
    const genres = await Genre.find();
    return res.status(200).json(genres);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error getting genres", error: error.message });
  }
};
