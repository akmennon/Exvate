const Category = require('../Models/category')
const errorHandler = require('../Resolvers/errorHandler')

/* Shows all categories */

module.exports.all = (req,res,next) =>{
    const body = req.body

    Category.findAll(body)
        .then((categoriesAll)=>{
            res.setHeader('full',categoriesAll.count)
            res.json(categoriesAll.categories)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}