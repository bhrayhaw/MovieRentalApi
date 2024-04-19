const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (request, response, next) {
  const token = request.header("x-auth-token");
  if (!token) return response.status(401).send("Access Denied: No Token Found");
  try {
    const decoded = jwt.verify(token, config.get("jwtKey"));
    request.user = decoded;
    next();
  } catch (error) {
    response.status(400).send("Invalid Token");
  }
}