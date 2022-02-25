const {validationResult} = require('express-validator')

const validationErrors = (req,next) =>{
    const errors = validationResult(req).array({onlyFirstError:true})
    if(errors.length==0){
        return null
    }
    else{
        const error = new Error()
        error.statusCode = 403
        error.message = errors[0].msg
        next(error)
    }
}

module.exports = validationErrors