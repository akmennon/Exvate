const Option = require('../Models/work/optionSubdoc')

/* PENDING*/
/* Middleware that finds and options for the work Id and saved to body */
module.exports.findOption = (req,res,next) =>{
    const body = req.body

    if(req.body.select=='delete'){
        next()
    }

    const option = new Option(body)
    req.body.options = option
    next()
}