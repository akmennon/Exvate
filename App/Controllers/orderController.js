const Order = require('../Models/order')
const errorHandler = require('../Resolvers/errorHandler')
const {matchedData} = require('express-validator')
const validationErrors = require('../Resolvers/validationErrors')

/* creates an order */
module.exports.create = async (req,res,next) =>{
    const user = req.user
    validationErrors(req,next)
    const data = matchedData(req, { locations: ['body','params'], includeOptionals: true })
    
    Order.createOrder(data.orderData,data.id,user)
        .then((result)=>{
            res.json(result)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

/* finds the details of the order if present in user */
module.exports.details = (req,res,next) =>{
    validationErrors(req,next)
    const data = matchedData(req, { locations: ['params'], includeOptionals: true })

    Order.orderDetails(data.id,req.user)
        .then((order)=>{
            res.json(order)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.userAll = (req,res,next) =>{
    validationErrors(req,next)
    const data = matchedData(req, { locations: ['body'], includeOptionals: true })

    Order.userAll(req.user,data.page,req.path,req.token)
        .then((response)=>{
            res.setHeader('total',response.count)
            res.json(response.orders)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
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
    validationErrors(req,next)
    const data = matchedData(req, { locations: ['params','headers'], includeOptionals: true })

    Order.workOrders(data.id,data.page)
        .then((response)=>{
            res.setHeader('total',response.count)
            res.json(response.orders)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.getBidOrders = (req,res,next) =>{
    const user = req.user

    Order.getBidOrders(user,req.body)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}