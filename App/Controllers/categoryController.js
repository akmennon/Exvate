const Category = require('../Models/category')
const errorHandler = require('../Resolvers/errorHandler')
const {matchedData} = require('express-validator')
const validationErrors = require('../Resolvers/validationErrors')

/* Shows all categories */

module.exports.all = (req,res,next) =>{
    const result = validationErrors(req,next)
    const body = matchedData(req, { locations: ['body'], includeOptionals: true })

    if(result.status){
        Category.findAll(body)
        .then((categoriesAll)=>{
            res.setHeader('full',categoriesAll.count)
            res.json(categoriesAll.categories)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}