const express = require("express");
const auth = require("../middleware/authmiddleware");
const admin = require("../middleware/rolemiddleware");
const router = express.Router();
const { Genres, validateGenres } = require("../models/genre");
const { Movie, validateMovie } = require("../models/movie");

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Get Genres
 *     description: Fetch the list of genres from the database
 *     tags:
 *       - Genres
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: Genres fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Genre'
 *       '400':
 *         description: Failed to fetch genres
 */
router.get("/", async (request, response, next) => {
  try {
    const genres = await Genres.find();
    response.status(200).json(genres);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/genres/{id}:
 *   get:
 *     summary: Get Genres
 *     description: Fetch the list of genres from the database based on id
 *     tags:
 *       - Genres
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of Genre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Genres fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       '400':
 *         description: Failed to fetch genres
 */
router.get("/:id", auth, async (request, response) => {
  const genre = await Genres.findById(request.params.id);
  if (!genre)
    return response.status(400).json("Genre not with the given id not found");
  response.status(200).json(genre);
});

/**
 * @swagger
 * /api/genres/{id}/movies:
 *   get:
 *     summary: Get movies based on a specific genre
 *     tags:
 *       - Genres
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the genre to get movies for
 *     responses:
 *       '200':
 *         description: A list of movies belonging to the specified genre
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movie'
 *       '404':
 *         description: Genre not found
 *       '500':
 *         description: Internal server error
 */
router.get("/:id/movies", auth, async (request, response, next) => {
  try {
    const genre = await Genres.findById(request.params.id);
    if (!genre) {
      return response.status(404).json({ error: "Genre not found" });
    }
    const movies = await Movie.find({ "genre._id": genre._id });
    response.status(200).json(movies);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/genres:
 *   post:
 *     summary: Create a new genre
 *     description: Create a new genre in the database.
 *     tags:
 *       - Genres
 *     security:
 *       - TokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       '201':
 *         description: Genre created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       '400':
 *         description: Invalid request data
 */
router.post("/", [auth, admin], async (request, response) => {
  const { error } = validateGenres(request.body);
  if (error) return response.status(404).json(error.details[0].message);
  let genre = new Genres({
    name: request.body.name,
  });
  genre = await genre.save();
  response.status(201).json(genre);
});

/**
 * @swagger
 * /api/genres/{id}:
 *   put:
 *     summary: Update a genre
 *     description: Update a genre in the database.
 *     tags:
 *       - Genres
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the genre to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Genre'
 *     responses:
 *       '200':
 *         description: Genre updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Genre'
 *       '404':
 *         description: Genre not found
 */
router.put("/:id", auth, async (request, response) => {
  const { error } = validateGenres(request.body);
  if (error) return response.status(404).json(error.details[0].message);

  const genre = await Genres.findByIdAndUpdate(
    request.params.id,
    {
      name: request.body.name,
      movie: request.body.movie,
    },
    { new: true }
  );
  if (!genre) return response.status(404).json("Selected Genre not found");
  response.json(genre);
});

/**
 * @swagger
 * /api/genres/{id}:
 *   delete:
 *     summary: Delete a genre
 *     description: Delete a genre from the database.
 *     tags:
 *       - Genres
 *     security:
 *       - TokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the genre to delete
 *     responses:
 *       '200':
 *         description: Genre deleted successfully
 *       '404':
 *         description: Genre not found
 */
router.delete("/:id", [auth, admin], async (request, response) => {
  const genre = await Genres.findByIdAndRemove(request.params.id);
  if (!genre)
    return response.status(404).json("Selected genre for deletion not found");

  response.json(genre);
});

module.exports = router;
