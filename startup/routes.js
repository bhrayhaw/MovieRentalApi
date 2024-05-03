const express = require('express')
const errorMiddleware = require("../middleware/errorMiddleware.js");
const home = require('../routes/home.js');
const genres = require('../routes/genres.js');
const customers = require('../routes/customers.js');
const movies = require('../routes/movies.js');
const rentals = require('../routes/rentals.js');
const users = require('../routes/users.js');
const auth = require('../routes/auth.js');

module.exports = function(app){
    app.use(express.json());
    app.use('/', home);
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use(errorMiddleware);
}