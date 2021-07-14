const User = require('../Models/user')
const errorHandler = require('../Resolvers/errorHandler')

/* Admin middleware which checks if the user is an admin and also authenticates */

    /* Admin authentication using token */

    module.exports.authAdminToken = (req,res,next) =>{
        const token = req.header('x-admin')

        if(!token){
            res.status(401).send('Token not available')
        }
        else{
            User.findByAdminToken(token)
                .then(function(user){
                    req.user = user
                    req.token = token
                    next()
                })
                .catch(function(err){
                    errorHandler(err,next)
                })
        }
    }

    /* Admin authentication using username and password */
    
    module.exports.authAdminSign = (req,res,next) =>{
        const body = req.body
        const token = req.header('x-admin')

        User.adminSignAction(body.email,body.password,token)
            .then(function(user){
                req.user = user
                next()
            })
            .catch(function(err){
                errorHandler(err,next)
            })
    }