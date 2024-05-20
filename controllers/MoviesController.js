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
      category,
      sortBy,
      sortOrder = "asc",
      skip = 0,
      limit = 25,
    } = req.query;

    const filter = {};
    const allWordsFilter = {};
    const anyWordFilter = {};

    if (title) {
      const words = title.split(" ").filter((word) => word.length > 0);
      const allWordsRegex = words.map((word) => `(?=.*${word})`).join("");
      const anyWordRegex = words.join("|");

      allWordsFilter.Title = new RegExp(allWordsRegex, "i");
      anyWordFilter.Title = new RegExp(anyWordRegex, "i");
    }
    if (genre) {
      filter.Genre = new RegExp(genre, "i");
      allWordsFilter.Genre = filter.Genre;
      anyWordFilter.Genre = filter.Genre;
    }
    if (type) {
      filter.Type = new RegExp(type, "i");
      allWordsFilter.Type = filter.Type;
      anyWordFilter.Type = filter.Type;
    }
    if (language) {
      filter.Language = new RegExp(language, "i");
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
      filter.Rated = new RegExp(rated, "i");
      allWordsFilter.Rated = filter.Rated;
      anyWordFilter.Rated = filter.Rated;
    }
    if (category) {
      const categories = Array.isArray(category) ? category : [category];
      filter.Category = { $in: categories };
      allWordsFilter.Category = { $in: categories };
      anyWordFilter.Category = { $in: categories };
    }

    const sort = {};
    if (sortBy) sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    const allWordsMovies = await Movie.find(allWordsFilter)
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    const anyWordMovies = await Movie.find(anyWordFilter)
      .sort(sort)
      .skip(parseInt(skip))
      .limit(parseInt(limit));

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
      skip: parseInt(skip),
      hasMore: parseInt(skip) + combinedMovies.length < totalMovies,
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

export const getLatestMovies = async (req, res) => {
  try {
    const limit = 10;

    const latestMovies = await Movie.find().sort({ Year: -1 }).limit(limit);

    return res.status(200).json({
      data: latestMovies,
      total: latestMovies.length,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching latest movies", error: error.message });
  }
};

export const getMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findOne({
      imdbID: id,
    });
    return res.status(200).json(movie);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching movie", error: error.message });
  }
};
