const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const {Rental, validateRental} = require('../models/rental');
// const Fawn = require('fawn');

// Fawn.init(mongoose)

router.get('/', async(request, response)=>{
    const rentals = await Rental.find().sortBy('-dateOut');
    response.send(rentals);
});

router.post('/', async(request, response) => {
    const { error } = validateRental(request.body);
    if (error) { return response.status(400).send(error.details[0].message)};

    const session = await mongoose.startSession();

    try{
        session.startTransaction();

        const customer = await Customer.findById(request.body.customerId).session(session);
        if (!customer) { return response.status(400).send(error.details[0].message)};

        const movie = await Movie.findById(request.body.customerId).session(session);
        if (!movie) { return response.status(400).send(error.details[0].message)};

        let rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name,
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        });
        rental = await rental.save({session});

        movie.numberInStock--;
        await movie.save({session});

        await session.commitTransaction();
        await session.endSession();

        response.send(rental);

    }catch(err){
        session.abortTransaction();
        session.endSession();

        console.log("Error perform transaction", err);
        response.status(500).send("Something went wrong");
    }

});

module.exports = router