const Category = require('../Models/category')
const errorHandler = require('../Resolvers/errorHandler')

/* ADMINCHANGE Shows all categories */

module.exports.all = (req,res,next) =>{

    //use pagination
    Category.findAll()
        .then((categoriesAll)=>{
            res.setHeader('full',categoriesAll.count)
            res.json(categoriesAll.categories)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}
