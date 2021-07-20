const Order = require('../Models/order')
const Result = require('../Models/work/resultSubdoc')
const sendMail = require('../Resolvers/sendMail')
const errorHandler = require('../Resolvers/errorHandler')
const User = require('../Models/user')

/* creates an order (actually used in sockets) */
module.exports.create = async (req,res,next) =>{//use pick, Pending - different inputs than from socket - req.body = {orders:[orders],result:resultId}
    const body = req.body
    const user = req.user
    
    Result.findById(body.resultId).lean()//ResultId sent seperately from the frontend
        .then((result)=>{
            return Order.createOrder(body.orderData,result,user) //UNRELIABLE - Use pick here
        })
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

/* orders status is changed from draft to confirmed */
module.exports.confirm = (req,res) =>{
    const id = req.params.id
    let order

    Order.confirmOrder(id)
        .then((response)=>{
            order = response
            return User.saveOrder(order,order.userId)
        })
        .then(()=>{
            res.status(200).send('Order confirmed')
        })
        .catch((err)=>{
            console.log(err)
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

module.exports.paymentConfirm = (req,res) =>{
    const id = req.params.id
    const user = req.user
    const details = req.body.paymentDetails

    Order.paymentConfirm({id,user,details})
        .then((response)=>{
            res.json(response)
        })
        .catch((e)=>{
            console.log(e)
            res.json(e)
        })
}

module.exports.workOrderConfirm = (req,res) =>{//find the use
    const id = req.params.id

    Order.findById(id)
        .then((order)=>{
            if(order.userId!=req.user._id&&!req.user.isAdmin.value){
                console.log('a')
            }
        })
        .catch((e)=>{
            console.log(e)
            res.json('error fetching orders')
        })
}

module.exports.completeOrder = (req,res) =>{
    const orderId = req.params.orderId
    const user = req.user

    Order.completeOrder(orderId,user)
        .then((response)=>{
            res.json('Order completed. Waiting for verification.')
        })
        .catch((e)=>{
            console.log(e)
            res.status(400).send(e)
        })
}

module.exports.cancelOrder = (req,res) =>{
    const id = req.params.id
    const user = req.user

    Order.orderCancel(id,user,User)
        .then((response)=>{
            res.json('Order cancelled')
        })
        .catch((e)=>{
            res.json(e)
        })
}

module.exports.refundOrder = (req,res) =>{
    const id = req.params.id
    const user = req.user

    Order.refundComplete(id,user)
        .then((response)=>{
            res.json('Refund Acknowledged')
        })
        .catch((e)=>{
            res.json(e)
        })
}

module.exports.userAll = (req,res) =>{
    const id = req.params.id

    Order.userAll(id,req.user)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            res.json(err)
        })
}

module.exports.dashBoard = (req,res) =>{
    const user = req.user

    Order.dashBoard(user)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            res.json(err)
        })
}

module.exports.failedOrder = (req,res) =>{
    const user = req.user
    const id = req.params.id

    Order.failedOrder(id,user)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            res.status(400).send(err)
        })
}

module.exports.samples = (req,res) =>{
    const user = req.user
    const id = req.params.id
    const type = req.body.type

    Order.samples(id,type,user)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            console.log(err)
            res.status(400).send("Invalid action")
        })
}

module.exports.orderFns = (req,res) =>{
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
            console.log(err)
            res.status(400).send('Invalid action')
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

    Order.contractFinished(id,user)
        .then((response)=>{
            res.json(response)
        })
        .catch((e)=>{
            errorHandler(e,next)
        })
}