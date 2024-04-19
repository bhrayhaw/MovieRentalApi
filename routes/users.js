const express = require('express');
const _ = require("lodash");
const bcrypt = require('bcrypt');
const router = express.Router();
const {User, validateUser} = require('../models/user');

router.get('/', async(request, response) => {
    const users = await User.find().sort(name);

    response.send(users);
});

router.get('/:id', async(request, response) => {
    const user = await User.findById(request.params._id);
    if (!user) { return response.status(400).send("User not found")}

    response.send(user);
});

router.post('/', async(request, response) => {
    const {error} = validateUser(request.body)
    if (error) { return response.status(400).send(error.details[0].message); }

    let user = await User.findOne({ email: request.body.email});
    if (user) { return response.status(400).send('User already exists')}

    user = new User(_.pick(request.body, ['name', 'email', 'password']));
    const salt = 10;

    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    response.send(user);
});

module.exports = router;