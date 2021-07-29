const Work = require('../Models/work/work')
const errorHandler = require('../Resolvers/errorHandler')
const Type = require('../Models/type')
const Category = require('../Models/category')

/* Function to create a new Work */

module.exports.create = (req,res,next) =>{
    const body = req.body
    
    Work.createNew(body,Type,Category)
        .then(function(work){
            res.json(work)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

/* Function to show all works */

module.exports.all = (req,res,next) =>{
    const query = req.query

    Work.all(query,req.user)
        .then((works)=>{
            if(works.count){
                res.setHeader('full',works.count)
            }
            res.json(works.works)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

/* Function to display the entire details of a work */

module.exports.detail = (req,res,next) =>{
    const id = req.params.id
    Work.findById(id)
        .then(function(work){
            res.json(work)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

module.exports.searchAll = (req,res,next) =>{ //Highly unoptimized /Not a search at all

    Work.find({},'_id options title')
        .then((works)=>{
            res.json(works)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.workEdit = (req,res,next) =>{

    Work.workEdit(req.body,Type,Category)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}