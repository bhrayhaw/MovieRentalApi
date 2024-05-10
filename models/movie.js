const mongoose = require('mongoose');
const Joi = require('joi');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  genre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Genre",
    required: true,
  },

  rating: {
    type: Number,
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie){
    const schema = Joi.object({
        title: Joi.string().required(),
      genre: Joi.object({
        _id: Joi.string().required(),
        name: Joi.string().required()
        }).required(),
        rating: Joi.number().required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required(),
    })
    return schema.validate(movie);
}

exports.movieSchema = movieSchema;
exports.Movie = Movie;
exports.validateMovie = validateMovie;