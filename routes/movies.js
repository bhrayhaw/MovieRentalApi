const express = require('express');
const { Movie, validateMovie } = require('../models/movie');
const { Genres } = require('../models/genre');
const auth = require('../middleware/authmiddleware')
const router = express.Router();

router.get('/', async (request, response) => {
  const movie = await Movie.find().sort('name');
  response.send(movie);
});

router.post('/', auth, async (request, response) => {
  const { error } = validateMovie(request.body);
  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  const genre = await Genres.findOne(request.body.genreId);
  if (!genre) return response.status(404).send('Invalid Genre');

  const movie = new Movie({
    title: request.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    rating: request.body.rating,
    numberInStock: request.body.numberInStock,
    dailyRentalRate: request.body.dailyRentalRate,
  });
  await movie.save();
  response.send(movie);
});

router.get('/:id', async (request, response) => {
  const movie = await Movie.findById(request.params.id);
  if (!movie) {
    return response.status(400).send('Invalid Movie');
  }

  response.send(movie);
});

module.exports = router;
