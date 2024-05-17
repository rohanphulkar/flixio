import { Movie } from "../models/Movies.js";

export const getMovies = async (req, res) => {
  try {
    const {
      title,
      genre,
      type,
      language,
      imdbRating,
      adult,
      rated,
      sortBy,
      sortOrder = "asc",
      page = 1,
      limit = 25,
    } = req.query;

    const filter = {};
    const allWordsFilter = {};
    const anyWordFilter = {};

    if (title) {
      const words = title.split(" ").filter((word) => word.length > 0);
      const allWordsRegex = words.map((word) => `(?=.*${word})`).join("");
      const anyWordRegex = words.join("|");

      allWordsFilter.Title = new RegExp(allWordsRegex, "i"); // case-insensitive search for all words
      anyWordFilter.Title = new RegExp(anyWordRegex, "i"); // case-insensitive search for any word
    }
    if (genre) {
      filter.Genre = new RegExp(genre, "i"); // case-insensitive search
      allWordsFilter.Genre = filter.Genre;
      anyWordFilter.Genre = filter.Genre;
    }
    if (type) {
      filter.Type = new RegExp(type, "i"); // case-insensitive search
      allWordsFilter.Type = filter.Type;
      anyWordFilter.Type = filter.Type;
    }
    if (language) {
      filter.Language = new RegExp(language, "i"); // case-insensitive search
      allWordsFilter.Language = filter.Language;
      anyWordFilter.Language = filter.Language;
    }
    if (imdbRating) {
      filter.imdbRating = { $gte: parseFloat(imdbRating) };
      allWordsFilter.imdbRating = filter.imdbRating;
      anyWordFilter.imdbRating = filter.imdbRating;
    }
    if (adult !== undefined) {
      filter.Adult = adult === "true";
      allWordsFilter.Adult = filter.Adult;
      anyWordFilter.Adult = filter.Adult;
    }
    if (rated) {
      filter.Rated = new RegExp(rated, "i"); // case-insensitive search
      allWordsFilter.Rated = filter.Rated;
      anyWordFilter.Rated = filter.Rated;
    }

    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Find movies containing all words
    const allWordsMovies = await Movie.find(allWordsFilter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Find movies containing any word
    const anyWordMovies = await Movie.find(anyWordFilter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Combine results, ensuring no duplicates and placing allWordsMovies first
    const movieSet = new Set(
      allWordsMovies.map((movie) => movie._id.toString())
    );
    const combinedMovies = allWordsMovies.concat(
      anyWordMovies.filter((movie) => !movieSet.has(movie._id.toString()))
    );

    const totalMovies = await Movie.countDocuments(filter);

    return res.status(200).json({
      data: combinedMovies,
      total: totalMovies,
      page: parseInt(page),
      pages: Math.ceil(totalMovies / limit),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching movies", error: error.message });
  }
};

export const addMovie = async (req, res) => {
  try {
    const movieData = req.body;
    const movie = new Movie(movieData);
    await movie.save();
    return res.status(201).json({ message: "Movie added successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding movie", error: error.message });
  }
};
