const mongoose = require('mongoose')
const Result = require('./work/resultSubdoc')
const validator = require('validator')
const pick = require('lodash/pick')
const sendMail = require('../Resolvers/sendMail')

/* Resolver which calculates the price and time */
const calcResult = require('../Resolvers/calcResult')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    workId:{                                
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Work'
    },
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    values:{
        price:{
            type:Number
        },
        amount:{
            type:Number
        },
        time:{
            type:Number
        },
        instructions:{
            type:String
        },
        uploads:[{
            type:String
        }],
        variables:[{
          title:{
              type:String
          },
          value:{
              type:Number
          },
          unit:{
              type:String
          }
        }]
    },
    host:{
        assigned:[{
            type:Schema.Types.ObjectId,
            ref:'User'
        }],
        removed:[{
            type:Schema.Types.ObjectId,
            ref:'User'
        }]
    },
    affiliate:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    type:{
        type:String,
        validate:{
            validator:function(value){
                switch(value){
                    case 'Order':
                        return true
                    case 'Sample':
                        return true
                    default:
                        return false
                }
            },
            message:function(){
                return 'Invalid order type'
            }
        }
    },
    incoterm:{
        type:String,
        default:'Exworks',
        validate:{
            validator:function(value){
                switch(value){
                    case 'CIF':
                        return true
                    case 'FOB':
                        return true
                    case 'FCA':
                        return true
                    case 'CFR':
                        return true
                    case 'Exworks':
                        return true
                    case 'Domestic':
                        return true
                    default:
                        return false
                }
            },
            message:function(){
                return 'Invalid Incoterm'
            }
        }
    },
    status:{
        type:String,
        default:'Draft',
        validate:{
            validator:function(value){
                switch(value){
                    case 'Draft':
                        return true
                    case 'Pending':
                        return true
                    case 'Sampling':
                        return true
                    case 'Active':
                        return true
                    case 'Transit':
                        return true
                    case 'Completed':
                        return true
                    case 'Finished':
                        return true
                    case 'Cancelled':
                        return true
                    case 'Failed':
                        return true
                    default:
                        return false
                }
            },
            message:function(){
                return 'Invalid order status'
            }
        }
    },
    shipmentDetails:{
        incoterm:{
            type:String,
            validate:{
                validator:function(value){
                    switch(value){
                        case 'CIF':
                            return true
                        case 'FOB':
                            return true
                        case 'FCA':
                            return true
                        case 'CFR':
                            return true
                        case 'Exworks':
                            return true
                        default:
                            return false
                    }
                },
                message:function(){
                    return 'Invalid Incoterm'
                }
            }
        },
        shipmentType:{
            type:String,
            validate:{
                validator:function(value){
                    switch(value){
                        case 'Cargo':
                            return true
                        case 'Courier':
                            return true
                        default:
                            return false
                    }
                },
                message:function(){
                    return 'Invalid shipping type'
                }
            }
        },
        port:{
            type:String
        },
        consignmentId:{
            type:String
        },
        serviceProvider:{
            type:String
        },
        statusLink:{
            type:String
        },
        CHA:{
            type:String
        }
    },
    completionVerified:[{
        verifiedBy:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        verifiedAt:{
            type:Date,
            default: Date.now
        }
    }],
    cancelVerified:[{
        verifiedBy:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        verifiedAt:{
            type:Date,
            default: Date.now
        }
    }],
    paymentStatus:{
        value:{
            type:String,
            default:'Pending',
            validate:{
                validator:function(value){
                    switch(value){
                        case 'Pending':
                            return true
                        case 'Completed':
                            return true
                        case 'Failed':
                            return true
                        case 'Contract':
                            return true
                        case 'Finished':
                            return true
                        case 'Refunded':
                            return true
                        default:
                            return false
                    }
                },
                message:function(){
                    return 'Invalid payment status'
                }
            }
        },
        hostPayment:{
            type:String,
            default:'Pending',
            validate:{
                validator:function(value){
                    switch(value){
                        case 'Pending':
                            return true
                        case 'Completed':
                            return true
                        case 'Failed':
                            return true
                        case 'Contract':
                            return true
                        case 'Finished':
                            return true
                        case 'Refunded':
                            return true
                        default:
                            return false
                    }
                },
                message:function(){
                    return 'Invalid payment status'
                }
            }
        },
        hostAmount:{
            type:Number
        },
        transaction:[{
            info:{
                type:String
            },
            status:{
                type:String,
                validate:{
                    validator:function(value){
                        switch(value){
                            case 'Successful':
                                return true
                            case 'Failed':
                                return true
                            default:
                                return 'Successful'
                        }
                    },
                    message:function(){
                        return 'Invalid transaction status'
                    }
                } 
            },
            paymentType:{
                type:String
            },
            createdAt:{
                type:Date,
                default: Date.now
            },
            createdBy:{
                type:Schema.Types.ObjectId,
                ref:'User'
            }
        }]
    },
    result:{
        type:Schema.Types.ObjectId,
        ref:'Result'
    },
    verified:{
        value:{
            type:Boolean,
            default:false
        },
        verifiedBy:[{
            value:{
                type:Schema.Types.ObjectId
            },
            createdAt:{
                type:Date,
                default:Date.now
            }
        }],
    },
    createdAt:{
        type:Date,
        default: Date.now
    },
    deadline:{
        type:Date
    },
    validTill:{
        type:Date
    }
})

/* creates one or multiple orders */
orderSchema.statics.createOrder = async function(orderValues,resultValue){
    const Order = this

    try{
        const orderFinal = await Promise.all(orderValues.map(async (orderValues)=>{

            try{
                let orderFinal,output
    
                /* workIds of frontend result and db result is matched
                    and the values are saved to the db result
                */

                if(resultValue.workId.toString() == orderValues.result.workId){
                    resultValue.values = orderValues.result.values
                    resultValue.time.values = orderValues.result.time.values
                }
        
                output = calcResult(resultValue,output) /*[{workId:"",price:1,time:1,amount:1}]*/
        
                let value
                orderFinal = orderValues.order
    
                /* since only one work is present */
                value = pick(output[0],['time','price'])
                Object.assign(orderFinal.values,value)
    
                const order = new Order(orderFinal)

                /* Result is modelled and saved */
                delete resultValue._id
                const result = new Result({...resultValue,orderId:order._id})
                const savedResult = await result.save()

                order.result = savedResult
                order.status = 'Pending'
    
                /* Order is modelled with result and saved */
                const savedOrder = await order.save()
                return Promise.resolve(savedOrder)
            }
            catch(e){
                return Promise.reject(e)
            }
        }))

        console.log(orderFinal)
        return Promise.resolve(orderFinal)
    }
    catch(e){
        console.log(e)
        return Promise.reject('Error creating order')
    }

}

/* Provides the entire details of an order */
orderSchema.statics.orderDetails = async function(id,user){
    const Order = this

    /* Checks if the order is present in the user */
    if(user.orders.includes(id)||user.isAdmin.value){
        try{
            let mainOrder = await Order.findById(id).populate('result').populate({path:'workId',select:'title'}).populate({path:'userId',select:'name email'})
            return Promise.resolve(mainOrder)
        }
        catch(e){
            console.log(e)
            return Promise.reject('Error in execution')
        }
    }
    else{
        return Promise.reject('Unauthorized')
    }
}

orderSchema.statics.delete = function(id){
    const Order = this

    return Order.findByIdAndDelete(id)
        .then((order)=>{
            console.log(order)
            return Promise.resolve(order)
        })
        .catch((err)=>{
            console.log(err)
            return Promise.reject('Error deleting draft')
        })
}

/* Verifies the order */
orderSchema.statics.verifyOrder = async function(id,body,user,User){
    const Order = this
    
    try{
        const verifiedValues = pick(body,['values','host'])/* PENDING - HOST TO SUPPLIER*/

        let order = await Order.orderDetails(id,user)

        //Verification is invalid for drafts
        if(order.status=='Draft'||order.status == 'Failed'){
            return Promise.reject('Order not valid for verification')
        }

        Object.assign(order.values,verifiedValues.values)
        order.verified.verifiedBy.push({value:user._id})
        order.paymentStatus.hostAmount = body.values.hostAmount
        if(verifiedValues.host.assigned){
            order.verified.value = true
            const index = order.host.removed.indexOf(verifiedValues.host.assigned)
            if(index!=-1){
                order.host.removed.splice(index,1)
            }
            const date = new Date()
            order.validTill = date.setDate(date.getDate()+body.values.validTill)
            order.host.assigned = [verifiedValues.host.assigned]
            await User.assignWork(order._id,verifiedValues.host.assigned,'assign')
        }
        if(verifiedValues.host.removed&&verifiedValues.host.removed.length!=0){
            if(verifiedValues.host.removed.includes(String(order.host.assigned[0]))){
                await User.assignWork(order._id,order.host.assigned[0],'remove')
                order.host.assigned = []
            }
            order.host.removed = [...new Set([...order.host.removed,...verifiedValues.host.removed])]
        }
        order = await order.save()
        return Promise.resolve(order)
    }
    catch(e){
        return Promise.reject(e)
    }
}

orderSchema.statics.paymentConfirm = async function({id,user,details}){
    const Order = this

    try{
        const order = await Order.findById(id).populate({path:'userId',select:'email'})
        if(order.status!='Pending'&&order.verified.value){
            return Promise.reject('Not applicable for the order')
        }
        const date = new Date()
        if(order.validTill.getTime()<date.getTime()){
            return Promise.reject('Order validity passed. Order needs to be validated again before confirmation.')
        }
        const transaction = {//should be changed according to transaction
            paymentType:details.type,
            createdBy:user._id,
            createdAt:new Date()
        }
        const deadline = new Date(details.deadline)
        if(details.type=='LC'){
            await Order.updateOne({_id:id},{'paymentStatus.value':'Contract',status:'Active',deadline:deadline,$push:{'paymentStatus.transaction':transaction}})
        }
        else{
            await Order.updateOne({_id:id},{'paymentStatus.value':'Completed',status:'Active',deadline:deadline,$push:{'paymentStatus.transaction':transaction}})
        }
        const mailData = {
            from: '"Sourceo" <ajaydragonballz@gmail.com>',
            to: order.userId.email.email, // list of receivers
            subject: "Payment Completed",
            text: `The payment has been confirmed.`
        }
        await sendMail(mailData)
        return Promise.resolve('Payment has been confirmed')
    }
    catch(e){
        console.log(e)
        return Promise.reject('Error confirming payment')
    }
}


orderSchema.statics.refundComplete = async function(id,user){
    const Order = this

    try{
        let order = await Order.findById(id)

        if(!order.verified.value||order.paymentStatus.value!='Completed'){
            return Promise.reject('Order not applicable for a refund')
        }

        if(order.status!='Cancelled'&&order.cancelVerified.length!=0){
            return Promise.reject('Order not cancelled for a refund')
        }

        order.paymentStatus.value = 'Refunded'
        order.paymentStatus.transaction.push({paymentType:'External',createdBy:user._id})
        order.completionVerified.push({verifiedBy:user._id})
        order = await order.save()
        return order
    }
    catch(e){
        console.log(e)
        return Promise.reject('Error acknowleging refund')
    }
}

orderSchema.statics.userAll = async function(id,user){
    const Order = this

    try{
        if(user.isAdmin.value){
            const orders = await Order.find({userId:id}).populate({path:'workId',select:'title'})
            console.log(orders)
            return Promise.resolve(orders)
        }
        else{
            const orders = await Order.find({userId:user.id})
            console.log(orders)
            return Promise.resolve(orders)
        }
    }
    catch(e){
        console.log(e)
        return Promise.reject('Error fetching orders')
    }
}

orderSchema.statics.dashBoard = async function(user){
    const Order = this

    try{
        const unverified = await Order.find({'verified.value':false}).sort({createdAt:'desc'}).limit(10)
        console.log(unverified)
        const paid = await Order.find({'paymentStatus.value':'Completed'}).sort({'paymentStatus.transaction.createdAt':'desc'}).limit(10)
    }
    catch(e){
        console.log(e)
        return Promise.reject('Error fetching dashboard')
    }
}

orderSchema.statics.orderFns = async function(id,type,user,details,User){
    const Order = this

    if(!id||!type||!user.isAdmin.value){
        return Promise.reject('Invalid action')
    }

    console.log(type)

    try{

        const order = await Order.findById(id)
        if(type!='cancel'&&(!order.verified.value||(order.paymentStatus.value!='Completed'&&order.paymentStatus.value!='Contract'))){
            return Promise.reject('Not a approved/verified/payment completed or in contract order')
        }

        switch(type){

            case 'complete': {

                if(!user.isAdmin&&!user.isAdmin.value){ //PENDING USER CONFIRMATION FOR COMPLETION
                    if(!user.work.workOrder.includes(id)){
                        return Promise.reject('Unauthorised')
                    }
                    const res = await Order.updateOne({_id:id,status:'Active'},{'status':'Completed'})
                    if(!res.nModified){
                        return Promise.reject('Not applicable for this order')
                    }
                    return Promise.resolve('Order updated')
                }
                else{
                    let total = 0
                    if(order.status!='Active'){
                        return Promise.reject('Not a sinlge/active order')
                    }
                    order.status = 'Completed'
                    await order.save()
                    return Promise.resolve('Order completed')
                }
            }

            case 'shipped': {

                let total = 0
                if(order.status!='Active'&&order.status!='Completed'){
                    return Promise.reject('Not a sinlge/active order')
                }
                order.status = 'Transit'
                order.shipmentDetails = details
                await order.save()
                return Promise.resolve('Order completed')
            }

            case 'finish':  {

                if(order.status!='Transit'){
                    return Promise.reject('Not a single or in transit order')
                }
                let total = 0
                order.status = 'Finished'
                order.completionVerified.push({verifiedAt:new Date(),verifiedBy:user._id})
                await order.save()
                return Promise.resolve('Order completed')
            }
                
            case 'cancel': {

                if(order.status=='Completed'||order.status=='Transit'||order.status=='Finished'||order.paymentStatus.value=='Contract'){
                    return Promise.reject('Invalid : A completed or a finished order')
                }
                order.status = 'Cancelled'
                order.cancelVerified.push({verifiedBy:user._id})
                await order.save()
                return Promise.resolve('Order cancelled')
            }

            case 'fail': {

                if(order.paymentStatus.value!='Contract'){
                    return Promise.reject('Not a contract')
                }
                order.status = 'Failed'
                order.completionVerified.push({verifiedBy:user._id})
                await order.save()
                return Promise.resolve('Status changed successfully')
            }

            default:
                return Promise.reject('Invalid function type')
        }

    }
    catch(e){
        console.log(e)
        return Promise.reject(e)
    }
}

orderSchema.statics.hostPayment = async function({id,user,details}){
    const Order = this
    console.log(details)

    try{
        const order = await Order.findById(id)
        if(order.paymentStatus.value!=='Completed'&&order.paymentStatus.value!=='Contract'&&order.paymentStatus.value!=='Finished'){
            return Promise.reject('Not available for this order')
        }

        if(details.statusPayment!='Finished'){
            order.paymentStatus.hostPayment = details.type=='LC'?'Contract':'Completed'
            order.paymentStatus.transaction.push({info:details.type,status:'Successful',paymentType:'Admin Created',createdBy:user._id})
            await order.save()
        }
        else{
            order.paymentStatus.hostPayment = 'Finished'
            order.paymentStatus.transaction.push({info:'Finished',status:'Successful',paymentType:'Admin Created',createdBy:user._id})
            await order.save()
        }
    }
    catch(e){
        console.log(e)
        return Promise.reject('Error')
    }
}

orderSchema.statics.contractFinished = async (id,user) => {

    try{
        const res = await Order.updateOne({_id:id,'paymentStatus.value':'Contract'},{$set:{'paymentStatus.value':'Finished'}})
        if(res.nModified==0){
            return Promise.reject('Invalid update action')
        }
        else{
            return Promise.resolve('Contract Finished')
        }
    }
    catch(e){
        console.log(e)
        return Promise.reject('Error updating')
    }
}

const Order = mongoose.model('Order',orderSchema)

module.exports = Order