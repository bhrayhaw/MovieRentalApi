const mongoose = require('mongoose');
const logger = require('../logger/logger')
const config = require('config')

module.exports = async function (){
    try {
      await mongoose.connect(config.get('uri'));
      logger.info('Database connection established');
    } catch (err) {
      logger.error('Error connecting to database...', err);
    }
  }

