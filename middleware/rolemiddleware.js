module.exports = function (request, response, next){
    if (!request.user.isAdmin) return response.status(403).json({'message': 'Access Denied'})
    next()
}