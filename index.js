const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const home = require('./routes/home.js');
const genres = require('./routes/genres.js');
const customers = require('./routes/customers.js');
const movies = require('./routes/movies.js');
const rentals = require('./routes/rentals.js');
const users = require('./routes/users.js');
const auth = require('./routes/auth.js');
const app = express();
const mongoose = require('mongoose');

if (!config.get('jwtKey')) {
  console.error('FATAL Error: jwtPrivateKey is not defined');
  process.exit(1);
}

const uri = 'mongodb://localhost/vidly';

async function dbconnection() {
  try {
    await mongoose.connect(uri);
    console.log('Database connection established......');
  } catch (err) {
    console.log('Error connecting to database...', err);
  }
}

dbconnection();

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json());
app.use('/', home);
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening to ${port}`);
});
