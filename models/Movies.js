import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    Source: { type: String, required: true },
    Value: { type: String, required: true },
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema({
  Title: { type: String, required: true },
  Year: { type: String, required: true },
  Rated: { type: String, required: true },
  Released: { type: Date, required: true },
  Runtime: { type: String, required: true },
  Genre: { type: [String], required: true },
  Director: { type: String, required: true },
  Writer: { type: String, required: true },
  Actors: { type: String, required: true },
  Plot: { type: String, required: true },
  Language: { type: [String], required: true },
  Country: { type: String, required: true },
  Awards: { type: String, required: true },
  Poster: { type: String, required: true },
  Ratings: { type: [ratingSchema], required: true },
  Metascore: { type: Number, required: true },
  imdbRating: { type: Number, required: true },
  imdbVotes: { type: String, required: true },
  imdbID: { type: String, required: true },
  Type: { type: String, required: true },
  DVD: { type: Date, required: true },
  BoxOffice: { type: String, default: "N/A" },
  Production: { type: String, default: "N/A" },
  Website: { type: String, default: "N/A" },
  Response: { type: String, required: true },
  Cover: { type: String, required: true },
  Adult: { type: Boolean, required: true },
  Links: { type: [String], default: [] },
});

export const Movie = mongoose.model("Movie", movieSchema);
