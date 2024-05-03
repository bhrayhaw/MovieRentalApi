const express = require('express');
const auth = require('../middleware/authmiddleware');
const admin = require('../middleware/rolemiddleware');
const router = express.Router();
const {Genres, validateGenres} = require('../models/genre');
const {Movie, validateMovie} = require('../models/movie');

router.get('/', async(request, response, next) => {
	try {
		throw new Error("Could not find genres")
		const genres = await Genres.find();
		response.send(genres);
	} catch (error) {
		next(error);
	}
});

router.get('/:id', async(request, response) => {
	const genre = await Genres.findById(request.params.id);
	if(!genre) return response.status(400).send("Genre not with the given id not found");
	response.send(genre);
});

router.post('/', auth, async(request, response) => {
	const {error} = validateGenres(request.body);
	if(error) return response.status(404).send(error.details[0].message);
	let genre = new Genres({
		name : request.body.name
	})
	genre = await genre.save();
	response.send(genre);
});

//POST a movie for a specific genre
router.post('/:id/movie', async(request, response) => {
	const {error} = validateMovie(request.body);
	if (error) { return response.status(400).send(error.details[0].message); }

	const genre = Genres.findById(request.params.id);
	if (!genre) { return response.status(400).send(error.details[0].message); }
	console.log(genre)

	const newmovie = new Movie({
		title: request.body.title,
		rating: request.body.rating,
		numberInStock: request.body.numberInStock,
		dailyRentalRate: request.body.dailyRentalRate
	});

	genre.movie.push(newmovie);
	await newmovie.save();
	response.send(newmovie);
})

router.put('/:id', async (request, response) => {
	const {error} = validateGenres(request.body);
	if(error) return response.status(404).send(error.details[0].message);

	const genre = await Genres.findByIdAndUpdate(request.params.id, {
		name: request.body.name,
		movie: request.body.movie}, {new: true});
	if(!genre) return response.status(404).send("Selected Genre not found")
	response.send(genre);
});

router.delete('/:id',[auth, admin], (request, response) => {
	const genre = Genres.findByIdAndRemove(request.params.id);
	if(!genre) return response.status(404).send('Selected genre for deletion not found');

	response.send(genre);
});

module.exports = router;