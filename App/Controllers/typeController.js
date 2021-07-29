const Type = require('../Models/type')
const Work = require('../Models/work/work')
const Category = require('../Models/category')
const errorHandler = require('../Resolvers/errorHandler')
/* Creates a Type */

module.exports.create = (req,res,next) =>{
    const user = req.user
    const body = req.body
    
    Type.createType(user,body.title,body.hscode)
        .then(function(type){
            res.json(type)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

/* Show all types */

module.exports.all = (req,res,next) =>{
    console.log(req.query)
    let query
    if(req.query.filter){
        query = req.query
        query.filter = JSON.parse(query.filter)
        query.sort = JSON.parse(query.sort)
        query.range = JSON.parse(query.range)
    }
    
    Type.find() //unreliable - kept so that category type selection would work - should be changed
        .then(async function(types){
            if(query){
                const count = await Type.estimatedDocumentCount()
                return Promise.resolve({types,count:`orders ${query.range[0]}-${query.range[1]}/${count}`})
            }
            else{
                return  Promise.resolve({types,count:1})
            }
        })
        .then((typesAll)=>{
            res.setHeader('full',typesAll.count)
            res.json(typesAll.types)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

module.exports.details = (req,res,next) =>{
    const id = req.params.id
    
    Type.findById(id)
        .then(function(types){
            res.json(types)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

/* Edit type */

module.exports.edit = (req,res,next) =>{
    const user = req.user
    const body = req.body
    const id = req.params.id

    Type.editType(id,body.title,body.hscode,user._id,Work,Category)
        .then(function(type){
            res.json(type)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}
