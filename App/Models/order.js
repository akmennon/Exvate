const mongoose = require('mongoose')
const Result = require('./work/resultSubdoc')
const validator = require('validator')
const pick = require('lodash/pick')
const sendMail = require('../Resolvers/sendMail')
const Option = require('./work/optionSubdoc.js')

/* Resolver which calculates the price and time */
const calcResult = require('../Resolvers/calcResult')
const User = require('./user')

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
    address:[{
        building:{
            type:String,
            maxlength:32,
            minlength:2
        },
        street:{
            type:String,
            maxlength:32,
            minlength:2
        },
        city:{
            type:String,
            maxlength:30,
            minlength:2
        },
        state:{
            type:String,
            maxlength:30,
            minlength:2
        },
        country:{
            type:String,
            maxlength:30,
            minlength:2
        },
        pin:{
            type:String,
            maxlength:30,
            minlength:2
        }
    }],
    supplier:{
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
        validate:{
            validator:function(value){
                switch(value){
                    case 'CIF':
                        return true
                    case 'FOB':
                        return true
                    case 'FCA':
                        return true
                    case 'FAS':
                        return true
                    case 'CFR':
                        return true
                    case 'CIP':
                        return true
                    case 'CPT':
                        return true
                    case 'DAP':
                        return true
                    case 'DDP':
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
        supplierPayment:{
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
        supplierAmount:{
            type:Number
        },
        transaction:[{
            info:{
                type:String,
                validate:{
                    validator:function(value){
                        switch(value){
                            case 'Advance':
                                return true
                            case 'LC':
                                return true
                            case 'Finished':
                                return true
                            default:
                                return false
                        }
                    },
                    message:function(){
                        return 'Invalid transaction status'
                    }
                }
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
                                return false
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
orderSchema.statics.createOrder = async function(orderValues,resultValue,user){
    const Order = this

    try{
        const option = await Option.findOne({workId:orderValues[0].order.workId,userId:{$exists:false}}).lean()
        const allOrders = []
        await Promise.all(orderValues.map(async (orderValue)=>{

            let orderFinal,output
    
            /* workIds of frontend result and db result is matched
                and the values are saved to the db result
            */

            if(resultValue.workId.toString() == orderValue.result.workId){
                resultValue.values = orderValue.result.values
                resultValue.time.values = orderValue.result.time.values
            }
            else{
                return Promise.reject({status:false,message:'Error creating order'})
            }
    
            output = calcResult(resultValue,output) /*[{workId:"",price:1,time:1,amount:1}]*/
    
            let value

            orderFinal = {
                userId:orderValue.order.userId,
                workId:orderValue.order.workId,
                values:{
                    variables:[]
                }
            }

            /* Variables are chosen from the backend and not from the frontend */
            option.params.map((ele,index)=>{
                orderFinal.values.variables[index] = {title:ele.title},
                orderFinal.values.variables[index].unit = ele.unit
                orderFinal.values.variables[index].value = resultValue.values[index]
            })

            /* since only one work is present */
            value = pick(output[0],['time','price'])
            orderFinal.values = {...orderFinal.values,...value}

            const order = new Order(orderFinal)

            /* Result is modelled and saved */
            delete resultValue._id
            const result = new Result({...resultValue,orderId:order._id})
            const savedResult = await result.save()

            order.result = savedResult
            order.status = 'Pending'

            /* Order is modelled with result and saved */
            const savedOrder = await order.save()
            allOrders.push(savedOrder._id)
        }))

        await user.saveOrder(allOrders)
        return Promise.resolve({status:true,message:'Order Created Successfully',statusCode:201})
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
    
    try{
        if(user.orders.includes(id)||user.isAdmin.value){
            let mainOrder = await Order.findById(id).populate('result').populate({path:'workId',select:'title'}).populate({path:'userId',select:'name email'})
            return Promise.resolve(mainOrder)
        }
        else{
            return Promise.reject({status:false,message:'Unauthorized',statusCode:401})
        }
    }
    catch(e){
        return Promise.reject(e)
    }
}

orderSchema.statics.listAll = async function(reqQuery){
    const Order = this
    
    try{
        let query = {}
        query.filter = JSON.parse(reqQuery.filter)
        query.sort = JSON.parse(reqQuery.sort)
        query.range = JSON.parse(reqQuery.range)
        
        const filter = {status:{$ne:'Draft'}}
        Object.assign(filter,query.filter)
        if(filter.verified){
            filter['verified.value'] = filter.verified.value
            delete filter.verified
        }

        console.log(filter)
        const limit = query.range[1]+1-query.range[0]

        /* Suborders are removed and orders are filtered by its status */
        const order = await Order.find(filter).populate('workId','title').populate('userId','email').skip(query.range[0]).limit(limit).sort({createdAt:-1})
        const count = await Order.countDocuments(filter)
        return Promise.resolve({order,count,query})
    }
    catch(e){
        return Promise.reject(e)
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
        const verifiedValues = pick(body,['values','supplier']) //Validation required (Pick)

        let order = await Order.orderDetails(id,user)

        //Verification is invalid for drafts or failed orders
        if(order.status=='Draft'||order.status == 'Failed'){
            return Promise.reject('Order not valid for verification')
        }

        Object.assign(order.values,verifiedValues.values)
        order.verified.verifiedBy.push({value:user._id})
        order.paymentStatus.supplierAmount = body.values.supplierAmount

        if(verifiedValues.supplier.assigned){
            order.verified.value = true
            const index = order.supplier.removed.indexOf(verifiedValues.supplier.assigned)
            if(index!=-1){
                order.supplier.removed.splice(index,1)
            }
            const date = new Date()
            order.validTill = date.setDate(date.getDate()+body.values.validTill)
            order.supplier.assigned = [verifiedValues.supplier.assigned]
            await User.assignWork(order._id,verifiedValues.supplier.assigned,'assign')
        }

        if(verifiedValues.supplier.removed&&verifiedValues.supplier.removed.length!=0){
            if(verifiedValues.supplier.removed.includes(String(order.supplier.assigned[0]))){
                await User.assignWork(order._id,order.supplier.assigned[0],'remove')
                order.supplier.assigned = []
            }
            order.supplier.removed = [...new Set([...order.supplier.removed,...verifiedValues.supplier.removed])]
            if(order.status == 'Pending'){
                order.verified.value = false
            }
        }

        order = await order.save()

        /*if(order.verified.value){
            const message = 'An order has been verified and is ready for payment'
            return User.notify('Order',order._id,message,order.userId)
        }*/

        const mailData = {
            from: '"Sourceo" <ajaydragonballz@gmail.com>',
            to: order.userId.email.email, // list of receivers
            subject: "Order Verified",
            text: order.values.price>90000?`The order prices have been updated and is ready for payment. The Bank details shall be provided shortly`:`The order prices have been updated and is ready for payment. Please use the website to make payment`
            /*html: "<b>Hello world?</b>"*/ // html body
        }
        const mail = await sendMail(mailData)

        if(mail){
            return Promise.resolve({status:true,message:'Verified and mail sent to the user'})
        }
        else{
            return Promise.resolve({status:true,message:'Mail not sent'})
        }
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

orderSchema.statics.orderFns = async function(id,type,user,details){
    const Order = this

    if(!id||!type||!user.isAdmin.value){
        return Promise.reject({status:false,message:'Invalid action',statusCode:403})
    }

    console.log(type)

    try{

        const order = await Order.findById(id)
        if(type!='cancel'&&(!order.verified.value||(order.paymentStatus.value!='Completed'&&order.paymentStatus.value!='Contract'))){
            return Promise.reject({status:false,message:'Not an approved order',statusCode:401})
        }

        switch(type){

            case 'complete': {

                if(!user.isAdmin&&!user.isAdmin.value){ //PENDING USER CONFIRMATION FOR COMPLETION
                    if(!user.orders.includes(id)){
                        return Promise.reject({status:false,message:'Unauthorised',statusCode:401})
                    }
                    if(order.status!='Transit'){
                        return Promise.reject({status:false,message:'Invalid order type',statusCode:403})
                    }
                    const res = await Order.updateOne({_id:id,status:'Transit'},{$set:{'status':'Completed'}})
                    if(!res.nModified){
                        return Promise.reject({status:false,message:'Not applicable for this order',statusCode:401})
                    }
                    return Promise.resolve({status:true,message:'Order Updated',statusCode:201})
                }
                else{
                    if(order.status!='Transit'){
                        return Promise.reject({status:false,message:'Invalid order type',statusCode:403})
                    }
                    order.status = 'Completed'
                    await order.save()
                    return Promise.resolve({status:true,message:'Order completed',statusCode:201})
                }
            }

            case 'shipped': {

                if(order.status!='Active'){
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

orderSchema.statics.supplierPayment = async function({id,user,details,User}){
    const Order = this
    console.log(details)

    try{
        const order = await Order.findById(id)
        if(order.paymentStatus.value!=='Completed'&&order.paymentStatus.value!=='Contract'&&order.paymentStatus.value!=='Finished'){
            return Promise.reject({status:false,message:'Not available for this order',statusCode:403})
        }

        if(details.statusPayment!='Finished'){
            order.paymentStatus.supplierPayment = details.type=='LC'?'Contract':'Completed'
            order.paymentStatus.transaction.push({info:details.type,status:'Successful',paymentType:details.type,method:'Admin Created',createdBy:user._id})
            await order.save()
        }
        else{
            order.paymentStatus.supplierPayment = 'Finished'
            order.paymentStatus.transaction.push({info:'Finished',status:'Successful',method:'Admin Created',createdBy:user._id})
            await order.save()
            await User.supplierWorkComplete(order.supplier.assigned[0],order._id)
        }
    }
    catch(e){
        console.log(e)
        return Promise.reject(e)
    }
}

/* LAST - Check if supplier payment is contract - if yes - finish it too */
orderSchema.statics.contractFinished = async (id,user) => {

    try{
        const order = await Order.findOneAndUpdate({_id:id,'paymentStatus.value':'Contract'},{$set:{'paymentStatus.value':'Finished'},$push:{'paymentStatus.transaction':{info:'Finished',status:'Successful',method:'Admin Created',createdBy:user._id}}})
        const res = await User.supplierWorkComplete(order.supplier.assigned[0],order._id)
        if(res.nModified==0){
            return Promise.reject({status:false,message:'Invalid update action',statusCode:403})
        }
        else{
            return Promise.resolve({status:true,message:'Contract Finished',statusCode:403})
        }
    }
    catch(e){
        console.log(e)
        return Promise.reject({status:false,message:'Error updating',statusCode:403})
    }
}

const Order = mongoose.model('Order',orderSchema)

module.exports = Order