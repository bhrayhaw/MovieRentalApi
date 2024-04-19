const mongoose = require("mongoose");
const Joi = require("joi");

const customerSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    isGold: {
        type: Boolean
    },
    phone: {
        type: Number,
        required: true
    }
})

const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().required(),
        isGold: Joi.boolean().required(),
        phone: Joi.number().required()
    })
    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;