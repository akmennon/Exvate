const Work = require('../Models/work/work')
const errorHandler = require('../Resolvers/errorHandler')
const {matchedData} = require('express-validator')
const validationErrors = require('../Resolvers/validationErrors')

/* Function to display the entire details of a work */

module.exports.detail = (req,res,next) =>{
    validationErrors(req,next)
    const data = matchedData(req, { locations: ['params'], includeOptionals: true })

    Work.findById(data.id)
        .then(function(work){
            res.json(work)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

module.exports.searchAll = (req,res,next) =>{
    validationErrors(req,next)
    const data = matchedData(req, { locations: ['body'], includeOptionals: true })

    Work.searchAll(data.query,data.autoSearch,data.pageCount)
        .then((works)=>{
            res.setHeader('total',works.count)
            res.json(works.works)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}