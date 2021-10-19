const Category = require('../Models/category')
const errorHandler = require('../Resolvers/errorHandler')

/* ADMINCHANGE Shows all categories */

module.exports.all = (req,res,next) =>{
    console.log(req.query)
    let query
    if(req.query.range){
        query = req.query
        query.filter = JSON.parse(query.filter)
        query.sort = JSON.parse(query.sort)
        query.range = JSON.parse(query.range)
    }

    //use pagination
    Category.find().populate('type') //Unreliable - kept so that category selection in work creation would work - should be changed
        .then(async function(categories){
            if(query){
                const count = await Category.estimatedDocumentCount()
                return Promise.resolve({categories,count:`orders ${query.range[0]}-${query.range[1]}/${count}`})
            }
            else{
                return  Promise.resolve({categories,count:1})
            }
        })
        .then((categoriesAll)=>{
            res.setHeader('full',categoriesAll.count)
            res.json(categoriesAll.categories)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}
