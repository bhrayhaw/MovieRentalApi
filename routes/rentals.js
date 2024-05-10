const express = require("express");
const router = express.Router();
const { Rental, validateRental } = require("../models/rental");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const auth = require("../middleware/authmiddleware");
const mongoose = require("mongoose");

/**
 * @swagger
 * /api/rentals:
 *   get:
 *     summary: Retrieve all rentals
 *     tags:
 *       - Rentals
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Rentals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rental'
 *       500:
 *         description: Internal server error
 */
router.get("/", async (request, response) => {
  try {
    const rentals = await Rental.find().sort("-dateOut");
    response.status(200).json(rentals);
  } catch (error) {
    response.status(500).send("Internal server error");
  }
});

/**
 * @swagger
 * /api/rentals:
 *   post:
 *     summary: Create a new rental
 *     tags:
 *       - Rentals
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rental'
 *     responses:
 *       201:
 *         description: Rental created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rental'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/", auth, async (request, response) => {
  const { error } = validateRental(request.body);
  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const customer = await Customer.findById(request.body.customerId).session(
      session
    );
    if (!customer) {
      await session.abortTransaction();
      session.endSession();
      return response.status(400).send("Customer not found");
    }

    const movies = await Movie.find({
      _id: { $in: request.body.movieIds },
    }).session(session);
    if (movies.length !== request.body.movieIds.length) {
      await session.abortTransaction();
      session.endSession();
      return response.status(400).send("One or more movies not found");
    }

    let rentalFeeTotal = 0;
    const dateOut = request.body.dateOut;
    const dateReturned = request.body.dateReturned || Date.now(); // Default to current date if not provided

    for (const movie of movies) {
      const rentalDays = calculateRentalDays(dateOut, dateReturned);
      const rentalFee = rentalDays * movie.dailyRentalRate;
      rentalFeeTotal += rentalFee;
    }

    const rental = new Rental({
      customer: {
        _id: customer._id,
        name: customer.name,
        phone: customer.phone,
        isGold: customer.isGold,
      },
      movies: movies.map((movie) => ({
        _id: movie._id,
        title: movie.title,
        dailyRentalRate: movie.dailyRentalRate,
      })),
      rentalFeeTotal: rentalFeeTotal,
      dateOut: dateOut,
      dateReturned: dateReturned,
    });

    await rental.save({ session });

    await session.commitTransaction();
    session.endSession();

    response.status(201).json(rental);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    response.status(500).send("Internal server error");
  }
});

function calculateRentalDays(dateOut, dateReturned) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const diffDays = Math.round(Math.abs((dateReturned - dateOut) / oneDay));
  return diffDays > 0 ? diffDays : 1; // Minimum of 1 day rental
}

module.exports = router;
