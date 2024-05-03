const logger = require('../logger/logger')

module.exports = function (err, req, res, next) {
    logger.error(err.message, err);
    res.status(500).json({ message: "Something went wrong" });
};
