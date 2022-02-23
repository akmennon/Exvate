const errorHandler = require('../Resolvers/errorHandler')

const supplierCheck = (req,res,next) =>{
    const user = req.user

    user.supplierCheck()
        .then((response)=>{
            console.log(response)
            next()
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports = supplierCheck