const mongoose = require("mongoose");
const Joi = require("joi");

const rentalSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
    required: true,
  },
  rentalFeeTotal: {
    type: Number,
    required: true,
    min: 0,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
});

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
    rentalFeeTotal: Joi.number().min(0).required(),
    dateOut: Joi.date().required(),
    dateReturned: Joi.date(),
  });
  return schema.validate(rental);
}

exports.validateRental = validateRental;
exports.Rental = Rental;
