const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const logger = require('./logger/logger.js')
const app = express();
require('./startup/routes.js')(app)
require('./startup/dbconfig.js')()


if (!config.get('jwtKey')) {
  logger.error('FATAL Error: jwtPrivateKey is not defined');
  process.exit(1);
}

app.set('view engine', 'pug');
app.set('views', './views');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening to ${port}`);
  logger.info(`Listening to ${port}`);
});

