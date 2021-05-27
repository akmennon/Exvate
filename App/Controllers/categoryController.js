const Category = require('../Models/category')

/* Create category */

module.exports.create = (req,res) =>{
    const body = req.body
    const user = req.user

    Category.createCat(user, body)
        .then(function(category){
            res.json(category)
        })
        .catch(function(err){
            res.json(err)
        })
}

/* Shows all categories */

module.exports.all = (req,res) =>{
    console.log(req.query)
    let query
    if(req.query.range){
        query = req.query
        query.filter = JSON.parse(query.filter)
        query.sort = JSON.parse(query.sort)
        query.range = JSON.parse(query.range)
    }

    Category.find().populate('type')
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
            res.json(err)
        })
}

/* Edit category */

module.exports.edit = (req,res) =>{
    const body = req.body
    const id = req.params.id
    const user = req.user._id

    Category.editCat(id, body, user)
        .then(function(category){
            res.json(category)
        })
        .catch(function(err){
            res.json(err)
        })
}

module.exports.details = (req,res) =>{
    const id = req.params.id
    
    Category.findById(id)
        .then(function(category){
            res.json(category)
        })
        .catch(function(err){
            res.json(err)
        })
}