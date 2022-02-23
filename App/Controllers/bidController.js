const Bid = require('../Models/bid')
const Order = require('../Models/order')
const errorHandler = require('../Resolvers/errorHandler')

module.exports.create = (req,res,next) =>{
    const orderId = req.params.orderId
    const user = req.user
    const price = req.body.price

    Bid.createBid(orderId,price,user,Order)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.list = (req,res,next) =>{
    const user = req.user
    const body = req.body

    Bid.userList(user,body)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.deleteOldBids = (req,res,next) =>{
    const user = req.user
    const body = req.body

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
    const bidId = req.params.bidId

    Bid.removeBid(user,bidId)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}