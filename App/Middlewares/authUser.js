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
            if(user){
                if(user.isAdmin.value){
                    errorHandler({status:false,message:'Invalid Usertype',statusCode:403},next)
                }
                else if(user.perms.user.suspended.value){
                    console.log(new Date(user.perms.user.suspended.duration))
                    errorHandler({status:false,message:`Under suspension till`,statusCode:401},next)
                }
                else if(user.perms.user.banned.value){
                    errorHandler({status:false,message:`Banned`,statusCode:401},next)
                }
                else{
                    req.user=user
                    req.token=token
                    next()
                }
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