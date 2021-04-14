const User = require('../Models/user')

/* To authenticate by token for the user */

const authUser = (req,res,next) =>{
    const token = req.header('x-auth')

    if(!token){
        res.status(401).end('Token not available')
    }
    else{
        User.findByToken(token)
            .then(function(user){
                if(user){
                req.user=user
                req.token=token
                next()  
                }
                else{
                    res.status(401).send('Token not available')
                }
            })
            .catch(function(err){
                console.log(err)
            })
    }
}

module.exports = authUser