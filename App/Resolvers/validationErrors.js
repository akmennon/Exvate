const {validationResult} = require('express-validator')

const validationErrors = (req,next) =>{
    const errors = validationResult(req).array({onlyFirstError:true})
    if(errors.length==0){
        return {status:true}
    }
    else{
        return {status:false,message:errors[0].msg,statusCode:403}
    }
}

module.exports = validationErrors