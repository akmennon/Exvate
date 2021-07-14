const User = require('../Models/user')
const errorHandler = require('../Resolvers/errorHandler')

/* To authenticate by token for the user */

const authUser = (req,res,next) =>{
    const token = req.header('x-auth')

    if(!token){
        res.status(401).end('Token not available')
    }
    else{
        User.findByToken(token)
        .then(function(user){
            req.user=user
            req.token=token
            next()
        })
        .catch(function(err){
            errorHandler(err,next)
        })
    }
}

module.exports = authUser