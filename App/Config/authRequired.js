
const authRequired = (req,res,next) =>{
    if(req.user&&req.user._id){
        next()
    }
    else{
        throw {status:false, message:"Unauthorized", statusCode:403}
    }
}

module.exports = authRequired