const Order = require('../Models/order')
const errorHandler = require('../Resolvers/errorHandler')
const {matchedData} = require('express-validator')
const validationErrors = require('../Resolvers/validationErrors')

/* creates an order */
module.exports.create = async (req,res,next) =>{
    const user = req.user
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['body','params'], includeOptionals: true })

    if(result.status){
        Order.createOrder(data.orderData,data.id,user,req.app.locals.redisClient)
        .then((result)=>{
            res.json(result)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

/* finds the details of the order if present in user */
module.exports.details = (req,res,next) =>{
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['params'], includeOptionals: true })

    if(result.status){
        Order.orderDetails(data.id,req.user,req.path)
        .then((order)=>{
            res.json(order)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

module.exports.userAll = (req,res,next) =>{
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['body'], includeOptionals: true })

    if(result.status){
        Order.userAll(req.user,data.page,req.path,req.token)
        .then((response)=>{
            res.setHeader('total',response.count)
            res.json(response.orders)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

/* Pending */
module.exports.dashBoard = (req,res,next) =>{
    const user = req.user

    Order.dashBoard(user)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.workOrders = (req,res,next) =>{
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['params','headers'], includeOptionals: true })

    if(result.status){
        Order.workOrders(data.id,data.page,req.path)
        .then((response)=>{
            res.setHeader('total',response.count)
            res.json(response.orders)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

module.exports.getBidOrders = (req,res,next) =>{
    const user = req.user

    Order.getBidOrders(user,req.body,req.path)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}