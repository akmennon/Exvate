const Category = require('../Models/category')
const errorHandler = require('../Resolvers/errorHandler')
const Work = require('../Models/work/work')

/* Create category */

module.exports.create = (req,res,next) =>{
    const body = req.body
    const user = req.user

    Category.createCat(user, body)
        .then(function(category){
            res.json(category)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

/* Shows all categories */

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

/* Edit category */

module.exports.edit = (req,res,next) =>{
    const body = req.body
    const id = req.params.id
    const user = req.user._id

    Category.editCat(id, body, user,Work)
        .then(function(category){
            res.json(category)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

module.exports.details = (req,res,next) =>{
    const id = req.params.id
    
    Category.findById(id)
        .then(function(category){
            if(!category){
                return Promise.reject({status:false,message:'Category not found',statusCode:404})
            }
            res.json(category)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}