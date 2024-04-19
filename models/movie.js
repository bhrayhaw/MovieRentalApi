const mongoose = require('mongoose');
const Joi = require('joi');
const genreSchema = require('./genre');

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },

    rating: {
        type: Number,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        required: true
    }
})

const Movie = mongoose.model('Movie', movieSchema);

function validateMovie(movie){
    const schema = Joi.object({
        title: Joi.string().required(),
        genreId: Joi.objectId().required(),
        rating: Joi.number().required(),
        numberInStock: Joi.number().required(),
        dailyRentalRate: Joi.number().required(),
    })
    return schema.validate(movie);
}

exports.movieSchema = movieSchema;
exports.Movie = Movie;
exports.validateMovie = validateMovie;