const express = require("express");
const { Customer, validateCustomer } = require("../models/customer");
const auth = require("../middleware/authmiddleware");
const admin = require("../middleware/rolemiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: API endpoints for managing customers
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Fetch list of customers
 *     description: Fetch Customers
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: Fetched customers successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Unable to fetch customers
 */
router.get('/', async (request, response) => {
    const customers = await Customer.find();
    response.status(200).json(customers);
});

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Fetch customer by ID
 *     description: Fetch Customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Fetched customer successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Customer not found
 */
router.get('/:id', async (request, response) => {
    const customer = await Customer.findById(request.params.id);
    if (!customer) return response.status(400).send("Customer not found");
    response.status(200).json(customer);
});

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     description: Create a new customer in the database
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Invalid request data
 */
router.post('/', async (request, response) => {
    const { error } = validateCustomer(request.body);
    if (error) return response.status(400).send(error.details[0].message);
    let customer = new Customer({
        name: request.body.name,
        isGold: request.body.isGold,
        phone: request.body.phone
    });
    customer = await customer.save();
    response.status(201).json(customer);
});

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update an existing customer
 *     description: Update an existing customer in the database
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 */
router.put('/:id', async (request, response) => {
    const customer = await Customer.findByIdAndUpdate(request.params.id, {
        name: request.body.name,
        isGold: request.body.isGold,
        phone: request.body.phone
    }, { new: true });
    if (!customer) return response.status(404).send("Customer not found");
    response.status(200).json(customer);
});

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer
 *     description: Delete a customer from the database
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Customer not found
 */
router.delete('/:id', async (request, response) => {
    const customer = await Customer.findByIdAndDelete(request.params.id);
    if (!customer) return response.status(404).send("Customer not found");
    response.status(200).json(customer);
});

module.exports = router;
