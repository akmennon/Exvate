const User = require('../Models/user')

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
                    if(user&&user.isAdmin.value){
                        req.user = user
                        req.token = token
                        next()
                    }
                    else{
                        res.status(401).send('Invalid request')
                    }
                })
                .catch(function(err){
                    res.status(401).send(err)
                })
        }
    }

    /* Admin authentication using username and password */
    
    module.exports.authAdminSign = (req,res,next) =>{
        const body = req.body

        User.adminSignAction(body.email,body.password)
            .then(function(user){
                if(user&&user.isAdmin){
                    req.user = user
                    next()
                }
                else{
                    res.status(401).send('Invalid attempt')
                }
            })
            .catch(function(err){
                res.status(401).send(err)
            })
    }