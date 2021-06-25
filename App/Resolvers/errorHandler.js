
const errorHandler = (err,next) =>{
    console.log(err)
    const error = new Error()
    if(err.statusCode){
        error.statusCode = err.statusCode
        error.message = err.message
    }
    else{
        error.statusCode = 500
        error.message = 'Error Processing Request'
    }
    next(error)
}

module.exports = errorHandler