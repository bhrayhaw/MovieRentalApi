const swaggerJSDoc = require("swagger-jsdoc");
const swaggerDefinition = require("./swagger-definition");

const swaggerOptions = {
    swaggerDefinition,
    apis: ["./routes/*.js"]
}
const swaggerSpec = swaggerJSDoc(swaggerOptions)
module.exports = swaggerSpec

