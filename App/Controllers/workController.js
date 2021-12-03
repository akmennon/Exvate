const Work = require('../Models/work/work')
const errorHandler = require('../Resolvers/errorHandler')

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

module.exports.searchAll = (req,res,next) =>{

    Work.searchAll(req.body.query.trim(),req.body.autoSearch,req.body.pageCount)
        .then((works)=>{
            res.setHeader('total',works.count)
            res.json(works.works)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}