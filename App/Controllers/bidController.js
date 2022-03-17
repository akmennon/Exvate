const Bid = require('../Models/bid')
const Order = require('../Models/order')
const errorHandler = require('../Resolvers/errorHandler')
const {matchedData} = require('express-validator')
const validationErrors = require('../Resolvers/validationErrors')

module.exports.create = (req,res,next) =>{
    const user = req.user
    validationErrors(req,next)
    const data = matchedData(req, { locations: ['body','params'], includeOptionals: true })

    Bid.createBid(data.orderId,data.price,user,Order)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.list = (req,res,next) =>{
    const user = req.user
    validationErrors(req,next)
    const body = matchedData(req, { locations: ['body'], includeOptionals: true })

    Bid.userList(user,body,req.path)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.deleteOldBids = (req,res,next) =>{
    const user = req.user

    next()
    Bid.deleteOldBids(user)
        .then((response)=>{
            console.log(response)
        })
        .catch((err)=>{
            console.log(err)
        })
}

module.exports.remove = (req,res,next) =>{
    const user = req.user
    validationErrors(req,next)
    const params = matchedData(req, { locations: ['params'], includeOptionals: true })

    Bid.removeBid(user,params.bidId)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}