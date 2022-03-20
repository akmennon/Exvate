const Bid = require('../Models/bid')
const Order = require('../Models/order')
const errorHandler = require('../Resolvers/errorHandler')
const {matchedData} = require('express-validator')
const validationErrors = require('../Resolvers/validationErrors')

module.exports.create = (req,res,next) =>{
    const user = req.user
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['body','params'], includeOptionals: true })

    if(result.status){
        Bid.createBid(data.orderId,data.price,user,Order,req.app.locals.redisClient)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

module.exports.list = (req,res,next) =>{
    const user = req.user
    const result = validationErrors(req,next)
    const body = matchedData(req, { locations: ['body'], includeOptionals: true })

    if(result.status){
        Bid.userList(user,body,req.path)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

module.exports.deleteOldBids = (req,res,next) =>{
    const user = req.user

    next()
    Bid.deleteOldBids(user,req.app.locals.redisClient)
        .then((response)=>{
            console.log(response)
        })
        .catch((err)=>{
            console.log(err)
        })
}

module.exports.remove = (req,res,next) =>{
    const user = req.user
    const result = validationErrors(req,next)
    const params = matchedData(req, { locations: ['params'], includeOptionals: true })

    if(result.status){
        Bid.removeBid(user,params.bidId,req.app.locals.redisClient)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}