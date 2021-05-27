const Type = require('../Models/type')

/* Creates a Type */

module.exports.create = (req,res) =>{
    const user = req.user
    const body = req.body
    
    Type.createType(user,body.title,body.hscode)
        .then(function(type){
            res.json(type)
        })
        .catch(function(err){
            res.json(err)
        })
}

/* Show all types */

module.exports.all = (req,res) =>{
    console.log(req.query)
    let query
    if(req.query.filter){
        query = req.query
        query.filter = JSON.parse(query.filter)
        query.sort = JSON.parse(query.sort)
        query.range = JSON.parse(query.range)
    }
    
    Type.find()
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
            res.json(err)
        })
}

module.exports.details = (req,res) =>{
    const id = req.params.id
    
    Type.findById(id)
        .then(function(types){
            res.json(types)
        })
        .catch(function(err){
            res.json(err)
        })
}

/* Edit type */

module.exports.edit = (req,res) =>{
    const user = req.user
    const body = req.body
    const id = req.params.id

    Type.editType(id,body.title,body.hscode,user._id)
        .then(function(type){
            res.json(type)
        })
        .catch(function(err){
            res.json(err)
        })
}
