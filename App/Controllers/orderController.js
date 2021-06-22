const Order = require('../Models/order')
const User = require('../Models/user')
const Result = require('../Models/work/resultSubdoc')
const sendMail = require('../Resolvers/sendMail')

/* creates an order (actually used in sockets) */
module.exports.create = async (req,res) =>{//use pick, Pending - different inputs than from socket - req.body = {orders:[orders],result:resultId}
    const body = req.body
    
    Result.findById(body.resultId)//use ({workId:body.workId,orderId:{$exists:false}}) after updating database
        .then((result)=>{
            return Order.createOrder(body.orderData,result.result) //UNRELIABLE - Use pick here
        })
        .then((order)=>{
            return User.saveOrder(order,req.user._id)
        })
        .then((user)=>{
            res.json('Order Complete')
        })
        .catch((err)=>{
            console.log(err)
        })
}

/* finds the details of the order if present in user */
module.exports.details = (req,res) =>{
    const id = req.params.id

    Order.orderDetails(id,req.user)
        .then((order)=>{
            res.json(order)
        })
        .catch((err)=>{
            console.log(err)
        })
}

/* All orders */
module.exports.all = (req,res) =>{//Validation with switch
    let query = {}
    query.filter = JSON.parse(req.query.filter)
    query.sort = JSON.parse(req.query.sort)
    query.range = JSON.parse(req.query.range)
    
    const filter = {status:{$ne:'Draft'}}
    Object.assign(filter,query.filter)
    if(filter.verified){
        filter['verified.value'] = filter.verified.value
        delete filter.verified
    }
    console.log(filter)
    const limit = query.range[1]+1-query.range[0]
    
    /* Suborders are removed and orders are filtered by its status */
    Order.find(filter).populate('workId','title').populate('userId','email').skip(query.range[0]).limit(limit).sort({createdAt:-1})
        .then(async (orders)=>{
            const count = await Order.countDocuments(filter)//change
            return Promise.resolve({orders,count})
        })
        .then((orders)=>{
            res.setHeader('full',`orders ${query.range[0]}-${query.range[1]}/${orders.count}`)
            res.json(orders.orders)
        })
        .catch((err)=>{
            console.log(err)
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

module.exports.verifyOrder = (req,res) =>{
    const id = req.params.id
    const user = req.user
    const body = req.body

    let norder = {}

    Order.verifyOrder(id,body,user,User)    /* PENDING NOTIFICATION */
        .then((order)=>{
            norder = order
            console.log(order)
            res.json(order)
            /*if(order.verified.value){
                const message = 'An order has been verified and is ready for payment'
                return User.notify('Order',order._id,message,order.userId)
            }*/
            if(norder.values.price>90000){ //For external payments //create proper details for payment
                const mailData = {
                    from: '"Sourceo" <ajaydragonballz@gmail.com>',
                    to: norder.userId.email.email, // list of receivers
                    subject: "Order Verified",
                    text: `The order prices have been updated and is ready for payment. The Bank details shall be provided shortly`
                    /*html: "<b>Hello world?</b>"*/ // html body
                }
                return sendMail(mailData)
            }
            else{   //For online payments
                const mailData = {
                    from: '"Sourceo" <ajaydragonballz@gmail.com>',
                    to: norder.userId.email.email,
                    subject: "Order Verified",
                    text: `The order prices have been updated and is ready for payment. Please use the website to make payment`
                }
                return sendMail(mailData)
            }
        })
        .then((mail)=>{
            if(mail){
                console.log('Verified confirmation mail sent')
            }
        })
        .catch((err)=>{
            console.log(err)
            res.json(err)
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

module.exports.hostPayment = (req,res) =>{
    const id = req.params.id
    const user = req.user
    const details = req.body.paymentDetails

    Order.hostPayment({id,user,details})
        .then((response)=>{
            res.json(response)
        })
        .catch((e)=>{
            res.json(e)
        })
}

module.exports.contractFinished = (req,res) =>{
    const id = req.params.id
    const user = req.user

    Order.contractFinished(id,user)
        .then((response)=>{
            res.json(response)
        })
        .catch((e)=>{
            res.json(e)
        })
}