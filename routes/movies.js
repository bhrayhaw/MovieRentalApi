const express = require("express");
const { Movie, validateMovie } = require("../models/movie");
const { Genres } = require("../models/genre");
const auth = require("../middleware/authmiddleware");
const admin = require("../middleware/rolemiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Movies
 *   description: Movie management
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Retrieve all movies
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: A list of movies
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 */
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("title");
  res.status(200).json(movies);
});

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Retrieve a movie by ID
 *     tags: [Movies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the movie to retrieve
 *     responses:
 *       200:
 *         description: A single movie object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       404:
 *         description: Movie not found
 */
router.get("/:id", auth, async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }
  res.status(200).json(movie);
});

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Create a new movie
 *     tags: [Movies]
 *     security:
 *       - TokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *     responses:
 *       201:
 *         description: New movie created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Genre not found
 */
router.post("/", [auth, admin], async (req, res) => {
  // Validate the incoming movie data
  const { error } = validateMovie(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    // Find the genre by its ID
    const genre = await Genres.findById(req.body.genre._id);
    if (!genre) {
      return res.status(404).json({ error: "Genre not found" });
    }

    // Create a new movie based on the request body
    const movie = new Movie({
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      rating: req.body.rating,
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    });

    // Save the movie to the database
    await movie.save();

    // Add the movie to the genre's movies array
    genre.movies.push(movie);
    await genre.save();

    // Send back the newly created movie
    res.status(201).json(movie);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
