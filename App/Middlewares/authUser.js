const User = require('../Models/user')
const errorHandler = require('../Resolvers/errorHandler')

/* To authenticate by token for the user */

const authUser = (req,res,next) =>{
    const token = req.header('x-auth')

    if(!token){
        res.status(401).end('Token not available')
    }
    else{
        User.findByToken(token,req.path)
        .then(function(response){
            if(response.status){    //Used to logout if the token is already removed
                res.json(response)
            }
            else{
                if(!response.email.confirmed.value){
                    errorHandler({status:false,message:'Incomplete Signup',statusCode:401,payload:{signup:true}})
                }
                req.user=response
                req.token=token
                next()
            }
        })
        .catch(function(err){
            errorHandler(err,next)
        })
    }
}

module.exports = authUser