const winston = require('winston');
const config = require('config')
require('winston-mongodb');

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "./logger/error.log", level: "error" }),
      new winston.transports.MongoDB({ db: config.get('uri'), level: 'error' }),
      new winston.transports.File({filename: './logger/infolog.log', level: "info"})
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: "./logger/uncaughtExceptions.log" })
    ]
  });

  module.exports = logger;