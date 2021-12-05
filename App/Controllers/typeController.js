const Type = require('../Models/type')
const Work = require('../Models/work/work')
const Category = require('../Models/category')
const errorHandler = require('../Resolvers/errorHandler')

/*ADMINCHANGE - Show all types */

module.exports.all = (req,res,next) =>{
    
    Type.findAll()
    .then(response=>{
        res.setHeader('total',response.count)
        res.json(response.types)
    })
    .catch((err)=>{
        errorHandler(err,next)
    })
}
