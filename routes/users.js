const express = require("express");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();
const { User, validateUser } = require("../models/user");
const auth = require("../middleware/authmiddleware");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API endpoints for managing users
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get("/", async (request, response) => {
  const users = await User.find().sort("name");
  response.status(200).json(users);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Retrieve a user by ID
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID of the user to retrieve
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User not found
 */
router.get("/:id", auth, async (request, response) => {
  const user = await User.findById(request.params.id);
  if (!user) {
    return response.status(400).send("User not found");
  }
  response.status(200).json(user);
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Registers a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post("/", async (request, response) => {
  const { error } = validateUser(request.body);
  if (error) {
    return response.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({ email: request.body.email });
  if (user) {
    return response.status(400).send("User already exists");
  }

  user = new User(_.pick(request.body, ["name", "email", "password"]));
  const salt = 10;

  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  response.send(user);
});

module.exports = router;
