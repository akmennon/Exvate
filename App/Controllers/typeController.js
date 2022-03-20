const Type = require('../Models/type')
const errorHandler = require('../Resolvers/errorHandler')
const {matchedData} = require('express-validator')
const validationErrors = require('../Resolvers/validationErrors')

module.exports.all = (req,res,next) =>{
    const result = validationErrors(req,next)
    const body = matchedData(req, { locations: ['body'], includeOptionals: true })
    
    if(result.status){
        Type.findAll(body)
        .then(response=>{
            res.setHeader('total',response.count)
            res.json(response.types)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}
