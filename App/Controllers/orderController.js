const Order = require('../Models/order')
const errorHandler = require('../Resolvers/errorHandler')
const User = require('../Models/user')

/* creates an order */
module.exports.create = async (req,res,next) =>{
    const body = req.body
    const user = req.user
    const id = req.params.id
    
    Order.createOrder(body.orderData,id,user)
        .then((result)=>{
            res.json(result)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

/* finds the details of the order if present in user */
module.exports.details = (req,res,next) =>{
    const id = req.params.id

    Order.orderDetails(id,req.user)
        .then((order)=>{
            res.json(order)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.userAll = (req,res,next) =>{

    Order.userAll(req.user,req.body.page)
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
    const id = req.params.id
    const page = req.header('page')

    Order.workOrders(id,page)
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