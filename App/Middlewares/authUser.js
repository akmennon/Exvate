const User = require('../Models/user')
const errorHandler = require('../Resolvers/errorHandler')

/* To authenticate by token for the user */

const authUser = async (req,res) =>{
    const token = req.header('x-auth')
    const userId = req.header('userId')

    try{
        const response = await User.findByToken(token,req.path,userId)
        if(response){
            if(response.status){    //Used to logout if the token is already removed
                res.json(response)
            }
            else{
                if(!response.email.confirmed.value){
                    errorHandler({status:false,message:'Incomplete Signup',statusCode:401,payload:{signup:true}})
                }
                req.user=response
                req.token=token
            }
        }
        else{
            return Promise.resolve(false)
        }
    }
    catch(err){
        errorHandler(err,next)
    }
}

module.exports = authUser