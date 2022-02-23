const Type = require('../Models/type')
const errorHandler = require('../Resolvers/errorHandler')

module.exports.all = (req,res,next) =>{
    const body = req.body   //provide body and skip
    
    Type.findAll(body)
    .then(response=>{
        res.setHeader('total',response.count)
        res.json(response.types)
    })
    .catch((err)=>{
        errorHandler(err,next)
    })
}
