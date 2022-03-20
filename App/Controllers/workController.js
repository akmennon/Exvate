const Work = require('../Models/work/work')
const errorHandler = require('../Resolvers/errorHandler')
const {matchedData} = require('express-validator')
const validationErrors = require('../Resolvers/validationErrors')

/* Function to display the entire details of a work */

module.exports.detail = (req,res,next) =>{
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['params'], includeOptionals: true })

    if(result.status){
        Work.findById(data.id).cache({hashKey:data.id,pathValue:'workDetail'})
        .then(function(work){
            res.json(work)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(status,next)
    }
}

module.exports.searchAll = (req,res,next) =>{
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['body'], includeOptionals: true })

    if(result.status){
        Work.searchAll(data.query,data.autoSearch,data.pageCount)
        .then((works)=>{
            res.setHeader('total',works.count)
            res.json(works.works)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(status,next)
    }
}