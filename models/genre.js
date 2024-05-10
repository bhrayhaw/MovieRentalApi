const mongoose = require("mongoose");
const Joi = require("joi");
const { movieSchema } = require("./movie");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  movies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

const Genres = mongoose.model("Genres", genreSchema);

function validateGenres(genres) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
  });

  return schema.validate(genres);
}

exports.Genres = Genres;
exports.validateGenres = validateGenres;
exports.genreSchema = genreSchema;
