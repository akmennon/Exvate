const Order = require('../Models/order')
const errorHandler = require('../Resolvers/errorHandler')
const User = require('../Models/user')

/* creates an order (actually used in sockets) */
module.exports.create = async (req,res,next) =>{//use pick, Pending - different inputs than from socket - req.body = {orders:[orders],result:resultId}
    const body = req.body
    const user = req.user
    const id = req.params.id
    
    Order.createOrder(body.orderData,id,user) //UNRELIABLE - Use pick here
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

/* All orders */
module.exports.all = (req,res,next) =>{//Validation with switch
    const reqQuery = req.query

    Order.listAll(reqQuery)
    .then((result)=>{
        res.setHeader('full',`orders ${result.query.range[0]}-${result.query.range[1]}/${result.count}`)
        res.json(result.order)
    })
    .catch((err)=>{
        errorHandler(err,next)
    })
}

module.exports.verifyOrder = (req,res,next) =>{
    const id = req.params.id
    const user = req.user
    const body = req.body

    Order.verifyOrder(id,body,user,User)    /* PENDING NOTIFICATION */
        .then((result)=>{
            res.json(result)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.paymentConfirm = (req,res,next) =>{
    const id = req.params.id
    const user = req.user
    const details = req.body.paymentDetails

    Order.paymentConfirm({id,user,details})
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.completeOrder = (req,res,next) =>{
    const orderId = req.params.orderId
    const user = req.user

    Order.completeOrder(orderId,user)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.cancelOrder = (req,res,next) =>{
    const id = req.params.id
    const user = req.user

    Order.orderCancel(id,user,User)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.refundOrder = (req,res,next) =>{
    const id = req.params.id
    const user = req.user

    Order.refundComplete(id,user)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.userAll = (req,res,next) =>{
    const id = req.params.id

    Order.userAll(id,req.user)
        .then((response)=>{
            res.json(response)
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

module.exports.failedOrder = (req,res,next) =>{
    const user = req.user
    const id = req.params.id

    Order.failedOrder(id,user)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.samples = (req,res,next) =>{
    const user = req.user
    const id = req.params.id
    const type = req.body.type

    Order.samples(id,type,user)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.orderFns = (req,res,next) =>{
    const user = req.user
    const id = req.params.id
    const type = req.body.type
    const shippingDetails = req.body.shippingDetails
    console.log(shippingDetails)

    Order.orderFns(id,type,user,type=='shipped'?shippingDetails:null,User)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.supplierPayment = (req,res,next) =>{
    const id = req.params.id
    const user = req.user
    const details = req.body.paymentDetails

    Order.supplierPayment({id,user,details,User})
        .then((response)=>{
            res.json(response)
        })
        .catch((e)=>{
            errorHandler(e,next)
        })
}

module.exports.contractFinished = (req,res,next) =>{
    const id = req.params.id
    const user = req.user

    Order.contractFinished(id,user,User)
        .then((response)=>{
            res.json(response)
        })
        .catch((e)=>{
            errorHandler(e,next)
        })
}

module.exports.orderCharges = (req,res,next) =>{
    const id = req.params.id
    const details = req.body.details

    Order.orderCharges(id,details)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.removeCharges = (req,res,next) =>{
    const id = req.params.id
    const chargeId = req.body.id
    
    Order.removeCharges(id,chargeId)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}