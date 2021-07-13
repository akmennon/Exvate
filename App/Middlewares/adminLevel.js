const errorHandler = require('../Resolvers/errorHandler')

const adminLevel = (authLevel) =>{
    return (req,res,next) =>{
        if(req.user.isAdmin.value){
            if(req.user.isAdmin.auth>authLevel){
                errorHandler({status:false,message:'Unauthorized',statusCode:401},next)
            }
            else{
                next()
            }
        }
        else{
            errorHandler({status:false,message:'Unauthorized',statusCode:401},next)
        }
    }
}

module.exports = adminLevel