module.exports = function (err, request, response, next){
    response.status(500).json({"message": "Something went wrong"})
}