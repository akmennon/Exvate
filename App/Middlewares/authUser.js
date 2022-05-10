const User = require('../Models/user')
const errorHandler = require('../Resolvers/errorHandler')

/* To authenticate by token for the user */

const authUser = async (req,res,next) =>{
    const token = req.header('x-auth')+'.'+req.cookies['auth']
    const userId = req.header('userId')

    try{
        const response = await User.findByToken(token,req.path,userId,req,res)
        if(response){
            if(response.status){    //Used to logout if the token is already removed
                res.json(response)
            }
            else{
                if(!response.user.email.confirmed.value){
                    errorHandler({status:false,message:'Incomplete Signup',statusCode:401,payload:{signup:true}})
                }
                req.user=response.user
                req.token=response.token
                return Promise.resolve()
            }
        }
        else{
            const error = new Error()
            return Promise.reject(error)
        }
    }
    catch(err){
        errorHandler(err,next)
    }
}

module.exports = authUser