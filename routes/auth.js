const express = require('express');
const router = express.Router();
const Joi = require('joi');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const {User} = require('../models/user');

router.post('/', async(request, response) => {
    const {error} = authenticateUser(request.body);
    if (error) { return response.status(400).send(error.details[0].message); }

    const user = await User.findOne({ email: request.body.email});
    if (!user) { return response.status(400).send("Invalid email or password"); }

    const validPassword = await bcrypt.compare(
      request.body.password,
      user.password
    );
    if (!validPassword) { return response.status(400).send("Invalid email or Password"); }

    const token = user.getAuthToken()

    response.header('x-auth-token', token).send(token);

})

function authenticateUser(user){
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    });
    return schema.validate(user);
}
module.exports = router;