const express = require("express");
const { Customer, validateCustomer } = require("../models/customer");

const router = express.Router();

router.get('/', async (request, response) => {
    const customer = await Customer.find();

    response.send(customer);
})

router.get('/:id', async (request, response) => {
    const customer = await Customer.findById(request.params.id);

    if(!customer) return response.status(400).send("Customer not found");

    response.send(customer);
})

router.post('/', async (request, response) => {
    const {error} = validateCustomer(request.body);
    if(error) return response.status(400).send(error.details[0].message);

    let savedCustomer = new Customer({
        name: request.body.name,
        isGold: request.body.isGold,
        phone: request.body.phone
    })

    savedCustomer = await savedCustomer.save();

    response.send(savedCustomer);
})

router.put('/id', async (request, response) => {
    const updateCustomer = await Customer.findByIdAndUpdate(request.params.id, {
        name: request.body.name,
        isGold: request.body.isGold,
        phone: request.body.phone
    })

    if(!updateCustomer) return response.status(404).send("Customer not found");

    response.send(updateCustomer)
})

router.delete('/id', async (request, response) => {
    const deleteCustomer = await Customer.findByIdAndDelete(request.params.id);

    if(!deleteCustomer) return response.status(404).send("Customer not found");
    
    response.send(deleteCustomer)
})

module.exports = router;