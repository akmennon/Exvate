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
    sample:{
        sampleStatus:{
            type:String,
            default:'Pending',
            validate:{
                validator:function(value){
                    switch(value){
                        case 'Pending':
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
                    return 'Invalid sample status'
                }
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
        sampleRequired:{
            type:Boolean,
            default:true
        }
    },
    sampleApproved:{
        type:Boolean,
        default:false
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
        shipmentType:{
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
                    return 'Invalid shipping type'
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
                        default:
                            return false
                    }
                },
                message:function(){
                    return 'Invalid Incoterm'
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

/* creates a draft */
orderSchema.statics.createOrder = async function(orderValues,resultValue){
    const Order = this

    try{
        const orderFinal = await Promise.all(orderValues.map(async (orderValues)=>{

            try{
                let orderFinal,output
    
                /* workIds of frontend result and db result is matched
                    and the values are saved to the db result
                */
        
                const tempValue = resultValue.map((elements)=>{
                    let foundResult = orderValues.result.find((element)=>{
                        return elements.workId==element.workId
                    })
        
                    elements.values = foundResult.values
                    elements.time.values = foundResult.time.values
        
                    return elements
                })
        
                output = calcResult(tempValue,output) /*[{workId:"",price:1,time:1,amount:1}]*/
        
                /* checks if its a single or multiwork */
                if(!orderValues.order.subOrders){
                    let value
                    orderFinal = orderValues.order
        
                    /* since only one work is present */
                    value = pick(output[0],['time','price'])
                    Object.assign(orderFinal.values,value)
        
                    const order = new Order(orderFinal)

                    /* Result is modelled and saved */
                    const result = new Result({result:tempValue,orderId:order._id})
                    const savedResult = await result.save()

                    order.result = savedResult
                    order.status = 'Pending'
                    
        
                    /* Order is modelled with result and saved */
                    const savedOrder = await order.save()
                    return Promise.resolve(savedOrder)
                }
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

/* changes the status of a draft to pending */
orderSchema.statics.confirmOrder = async function(id){
    const Order = this

    let order = await Order.findById(id)

    /* checks if suborders are present */
    if(!order.subOrders||order.subOrders==[]){
        order.set('status','Pending')
        await order.save()
        return Promise.resolve(order)
    }
    else{

        /* changes the status for each suborder */
        for(let i=0;i<order.subOrders.length;i++){
            let subOrder = await Order.findById(order.subOrders[i])
            subOrder.set('status','Pending')
            await subOrder.save()
        }

        /* changes the status for the main order */
        order.set('status','Pending')
        await order.save()
        return Promise.resolve(order)
    }
}

/* Provides the entire details of an order */
orderSchema.statics.orderDetails = async function(id,user){
    const Order = this

    /* Checks if the order is present in the user */
    if(user.orders.includes(id)||user.isAdmin.value){
        try{
            let mainOrder = await Order.findById(id).populate('result').populate({path:'workId',select:'title'}).populate({path:'userId',select:'name'}).populate({path:'subOrders',populate:[{path:'workId',select:'title'},{path:'userId',select:'name'},{path:'result'}]})
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
    const verifiedValues = pick(body,['values','host'])/* values and host inside for subOrders and outside for main orders */

    let order = await Order.orderDetails(id,user)
    let subOrder = order//for naming in the if else statement

    let total = {price:0,time:0} //sum of all values from subOrders
    let totalVerifications = 0  //to make main order verified from suborder verifications

    //Verification is invalid for drafts
    if(order.status=='Draft'||order.status == 'Failed'){
        return Promise.reject('Order not valid for verification')
    }

    /* checks if suborders are present and verifies single work*/
    if(!order.subOrder){
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
            if(order.sample.sampleStatus!='Pending'){
                order.sample.sampleStatus = 'Active'
            }
            order.host.removed = [...new Set([...order.host.removed,...verifiedValues.host.removed])]
        }
        order = await order.save()
        return Promise.resolve(order)
    }

    /* for main order */
    else{

        order = await Order.findOne({'subOrders':{$elemMatch:{$eq:subOrder._id}}}).populate('subOrders')

        Object.assign(subOrder.values,verifiedValues.values)

        if(verifiedValues.host.assigned){
            const index = subOrder.host.removed.indexOf(verifiedValues.host.assigned)/* filter */
            if(index!=-1){
                subOrder.host.removed.splice(index,1)
            }
            const date = new Date()
            subOrder.validTill = date.setDate(date.getDate()+body.values.validTill)
            subOrder.host.assigned = [verifiedValues.host.assigned]
            await User.assignWork(subOrder._id,verifiedValues.host.assigned,'assign')
            subOrder.verified.value = true
            subOrder.verified.verifiedBy.push({value:user._id})
        }
        if(verifiedValues.host.removed&&verifiedValues.host.removed.length!=0){
            if(verifiedValues.host.removed.includes(String(subOrder.host.assigned[0]))){
                await User.assignWork(subOrder._id,subOrder.host.assigned[0],'remove')
                subOrder.host.assigned = []
                subOrder.verified.value = false
                order.verified.value = false
                if(order.sample.sampleStatus!='Pending'){
                    order.sample.sampleStatus = 'Active'
                }
                subOrder.host.removed = subOrder.host.removed.concat(verifiedValues.host.removed)
                subOrder.host.removed = [...new Set(subOrder.host.removed)]
            }
            else{
                if(order.sample.sampleStatus!='Pending'){
                    order.sample.sampleStatus = 'Active'
                }
                subOrder.host.removed = subOrder.host.removed.concat(verifiedValues.host.removed)
                subOrder.host.removed = [...new Set(subOrder.host.removed)]
                console.log(subOrder.host.removed)
            }
        }
        subOrder = await subOrder.save()

        let newValidTill = new Date()
        /* Totaling values for main order and verfied main order if sub orders are verfied automatically */
        for(let i=0;i<order.subOrders.length;i++){
            if(order.subOrders[i]._id==id){
                total.price = total.price + verifiedValues.values.price
                total.time = total.time + verifiedValues.values.time
                if(subOrder.verified.value==true){
                    totalVerifications = totalVerifications + 1
                }
                if(newValidTill.getTime()<subOrder.validTill.getTime()){
                    newValidTill = subOrder.validTill
                }
            }
            else{
                total.price = total.price + order.subOrders[i].values.price
                total.time = total.time + order.subOrders[i].values.time
                if(order.subOrders[i].verified.value==true){
                    totalVerifications = totalVerifications + 1
                }
                if(newValidTill.getTime()<order.subOrders[i].validTill.getTime()){
                    newValidTill = order.subOrders[i].validTill
                }
            }
        }  

        /* changes the verification for the main order */
        if(totalVerifications==order.subOrders.length){
            if(order.status!='Pending'&&order.status!='Active'&&order.status!='Finished'){
                order.status = 'Active'
            }
            order.validTill = newValidTill
            order.verified.value = true
            order.verified.verifiedBy.push({value:user._id})
            Object.assign(order.values,total)
            order = await order.save()
            return Promise.resolve(order)
        }

        if(order.verified.value==true){
            order.verified.value==false
        }
        Object.assign(order.values,total)
        order = await order.save() 
        return Promise.resolve(order)
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
            if(order.subOrders.length!=0){
                await Order.updateMany({_id:{$in:order.subOrders}},{$set:{'paymentStatus.value':'Contract','sample.sampleStatus':'Active',deadline:deadline}})
            }
            await Order.updateOne({_id:id},{'paymentStatus.value':'Contract','sample.sampleStatus':'Active',deadline:deadline,$push:{'paymentStatus.transaction':transaction}})
        }
        else{
            if(order.subOrders.length!=0){
                await Order.updateMany({_id:{$in:order.subOrders}},{$set:{'paymentStatus.value':'Completed','sample.sampleStatus':'Active',deadline:deadline}})
            }
            await Order.updateOne({_id:id},{'paymentStatus.value':'Completed',deadline:deadline,'sample.sampleStatus':'Active',$push:{'paymentStatus.transaction':transaction}})
        }
        const mailData = {
            from: '"Sourceo" <kajaymenon@hotmail.com>',
            to: order.userId.email.email, // list of receivers
            subject: "Order Verified",
            text: `The payment has been confirmed.`, // Email confirmation link
            /*html: "<b>Hello world?</b>"*/ // html body
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
        let order = await Order.findById(id).populate('subOrders')

        if(!order.verified.value||order.paymentStatus.value!='Completed'){
            return Promise.reject('Order not applicable for a refund')
        }

        if(order.status!='Cancelled'&&order.cancelVerified.length!=0){
            return Promise.reject('Order not cancelled for a refund')
        }

        if(order.subOrders.length!=0){
            await Order.updateMany(
                {_id:{$in:order.subOrders},completionVerified:{$size:0}},
                {
                    $set:{'paymentStatus.value':'Refunded'},
                    $push:{
                        'paymentStatus.transaction':{paymentType:'External',createdBy:user._id},
                        'completionVerified':{verifiedBy:user._id}
                    }
                })
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
            const orders = await Order.find({userId:id,subOrder:false}).populate('subOrders').populate({path:'workId',select:'title'})
            console.log(orders)
            return Promise.resolve(orders)
        }
        else{
            const orders = await Order.find({userId:user.id,subOrder:false}).populate('subOrders')
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
        if(type!='cancel'&&(!order.sampleApproved||!order.verified.value||(order.paymentStatus.value!='Completed'&&order.paymentStatus.value!='Contract'))){
            return Promise.reject('Not a approved/verified/payment completed or in contract order')
        }

        switch(type){

            case 'complete': {

                if(!user.isAdmin&&!user.isAdmin.value){ //PENDING USER CONFIRMATION FOR COMPLETION
                    if(!user.work.workOrder.includes(id)){
                        return Promise.reject('Unauthorised')
                    }
                    const res = await Order.updateOne({_id:id,status:'Active',subOrders:{$size:0},sampleApproved:true},{'status':'Completed'})
                    if(!res.nModified){
                        return Promise.reject('Not applicable for this order')
                    }
                    return Promise.resolve('Order updated')
                }
                else{
                    let total = 0
                    if(order.subOrders.length!=0||order.status!='Active'){
                        return Promise.reject('Not a sinlge/active order')
                    }
                    order.status = 'Completed'
                    await User.updateMany({_id:{$in:order.host.assigned}},{$push:{'work.workHistory':order._id},$pull:{'work.workOrder':order._id}})
                    if(order.subOrder){
                        await order.save()
                        let mainOrder = await Order.findOne({subOrders:order._id}).populate('subOrders')
                        for(i=0;i<mainOrder.subOrders.length;i++){
                            if(mainOrder.subOrders[i].status=='Completed'){
                                total = total + 1
                            }
                        }
                        if(total==mainOrder.subOrders.length){
                            mainOrder.status = 'Completed'
                            await mainOrder.save()
                        }
                    }
                    else{
                        await order.save()
                    }
                    return Promise.resolve('Order completed')
                }
            }

            case 'shipped': {

                let total = 0
                if(order.subOrders.length!=0||(order.status!='Active'&&order.status!='Completed')){
                    return Promise.reject('Not a sinlge/active order')
                }
                order.status = 'Transit'
                order.shipmentDetails = details
                await User.updateMany({_id:{$in:order.host.assigned}},{$push:{'work.workHistory':order._id},$pull:{'work.workOrder':order._id}})
                if(order.subOrder){
                    await order.save()
                    let mainOrder = await Order.findOne({subOrders:order._id}).populate('subOrders')
                    for(i=0;i<mainOrder.subOrders.length;i++){
                        if(mainOrder.subOrders[i].status=='Completed'||mainOrder.subOrders[i].status=='Transit'){
                            total = total + 1
                        }
                    }
                    if(total==mainOrder.subOrders.length){
                        mainOrder.status = 'Completed'
                        await mainOrder.save()
                    }
                }
                else{
                    await order.save()
                }
                return Promise.resolve('Order completed')
            }

            case 'finish':  {

                if(order.subOrders.length!=0||order.status!='Transit'){
                    return Promise.reject('Not a single or in transit order')
                }
                let total = 0
                order.status = 'Finished'
                order.completionVerified.push({verifiedAt:new Date(),verifiedBy:user._id})
                await User.updateMany({_id:{$in:order.host.assigned}},{$push:{'work.workHistory':order._id},$pull:{'work.workOrder':order._id}})
                if(order.subOrder){
                    await order.save()
                    let mainOrder = await Order.findOne({subOrders:order._id}).populate('subOrders')
                    for(i=0;i<mainOrder.subOrders.length;i++){
                        if(mainOrder.subOrders[i].status=='Finished'){
                            total = total + 1
                        }
                    }
                    if(total==mainOrder.subOrders.length){
                        mainOrder.status = 'Finished'
                        mainOrder.completionVerified.push({verifiedAt:new Date(),verifiedBy:user._id})
                        await mainOrder.save()
                    }
                }
                else{
                    await order.save()
                }
                return Promise.resolve('Order completed')
            }
                
            case 'cancel': {

                if(order.subOrder||order.status=='Completed'||order.status=='Transit'||order.status=='Finished'||order.paymentStatus.value=='Contract'){
                    return Promise.reject('Invalid : A subOrder or a completed or finished order')
                }
                order.status = 'Cancelled'
                order.cancelVerified.push({verifiedBy:user._id})
                if(order.subOrders!==0){
                    await Order.updateMany({_id:{$in:order.subOrders},status:{$nin:['Completed','Finished']}},{$set:{status:'Cancelled'},$push:{cancelVerified:{verifiedBy:user._id}}})
                    for(let i=0;i<order.subOrders.length;i++){
                        await User.updateOne({'work.workOrder':order.subOrders[i]},{$push:{'work.workHistory':order.subOrders[i]},$pull:{'work.workOrder':order.subOrders[i]}})
                    }
                    await order.save()
                    return Promise.resolve('Orders cancelled')
                }
                else{
                    await User.updateOne({_id:order.host.assigned[0]},{$pull:{'work.workOrder':id},$push:{'work.workHistory':id}})
                    await order.save()
                    return Promise.resolve('Order cancelled')
                }
            }

            case 'fail': {

                if(order.subOrder||order.paymentStatus.value!='Contract'){
                    return Promise.reject('Inavlid : A subOrder or not a contract')
                }
                await Order.updateMany({_id:{$in:order.subOrders}},{$set:{status:'Failed','paymentStatus.value':'Failed'},$push:{completionVerified:{verifiedBy:user._id}}})
                for(let i=0;i<order.subOrders.length;i++){
                    await User.updateOne({'work.workOrder':order.subOrders[i]},{$push:{'work.workHistory':order.subOrders[i]},$pull:{'work.workOrder':order.subOrders[i]}})
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

orderSchema.statics.samples = async function(id,type,user){
    const Order = this

    if(!id||!type||!user.isAdmin.value){
        return Promise.reject('Invalid action')
    }

    console.log(type)

    try{
        const order = await Order.findById(id)
        if(order.subOrders.length!=0||!order.verified.value||(order.paymentStatus.value!='Completed'&&order.paymentStatus.value!='Contract')){
            //not a single or a sub order
            return Promise.reject('Invalid request')
        }
        let total = 0
        switch(type){
            case 'Complete':
                if(order.sample.sampleStatus!='Active'){
                    return Promise.reject('Not an active sample order')
                }
                order.sample.sampleStatus = 'Completed'
                if(order.subOrder){
                    await order.save()
                    let mainOrder = await Order.findOne({subOrders:order._id}).populate('subOrders')
                    mainOrder.subOrders.map((ele)=>{
                        if(ele.sample.sampleStatus=='Completed'||ele.sample.sampleStatus=='Transit'||ele.sample.sampleStatus=='Finished'){
                            total = total +1
                        }
                        else{
                            console.log('Not applicable for the order')
                        }
                    })
                    if(mainOrder.subOrders.length==total){
                        mainOrder.sample.sampleStatus = 'Completed'
                        await mainOrder.save()
                    }
                }
                else{
                    await order.save()
                }
                return Promise.resolve('Sample Completed')
            case 'CompleteAndShipped':
                if(order.sample.sampleStatus!='Active'&&order.sample.sampleStatus!='Completed'){
                    return Promise.reject('Not an active/completed sample order')
                }
                order.sample.sampleStatus = 'Transit'
                if(order.subOrder){
                    await order.save()
                    let mainOrder = await Order.findOne({subOrders:order._id}).populate('subOrders')
                    mainOrder.subOrders.map((ele)=>{
                        if(ele.sample.sampleStatus=='Transit'||ele.sample.sampleStatus=='Completed'||ele.sample.sampleStatus=='Finished'){
                            total = total +1
                        }
                        else{
                            console.log(ele.sample.sampleStatus,'Not applicable for the order')
                        }
                    })
                    if(mainOrder.subOrders.length==total){
                        mainOrder.sample.sampleStatus = 'Completed'
                        await mainOrder.save()
                    }
                }
                else{
                    await order.save()
                }
                return Promise.resolve('Sample Completed and in Transit')
            case 'Finished':
                if(order.sample.sampleStatus!='Completed'&&order.sample.sampleStatus!='Transit'){
                    return Promise.reject('Not a complete/ in transit sample order')
                }
                order.sample.sampleStatus = 'Finished'
                order.sample.completionVerified.push({verifiedBy:user._id,verifiedAt:new Date()})
                order.sampleApproved = true
                order.status = 'Active'
                if(order.subOrder){
                    await order.save()
                    let mainOrder = await Order.findOne({subOrders:order._id}).populate('subOrders')
                    mainOrder.subOrders.map((ele)=>{
                        if(ele.sample.sampleStatus=='Finished'&&ele.sample.completionVerified.length!=0){
                            total = total +1
                        }
                        else{
                            console.log('Order not finished completely')
                        }
                    })
                    if(mainOrder.subOrders.length==total){
                        mainOrder.sample.sampleStatus = 'Finished'
                        mainOrder.sampleApproved = true
                        mainOrder.sample.completionVerified.push({verifiedBy:user._id,verifiedAt:new Date()})
                        mainOrder.status = 'Active'
                        await mainOrder.save()
                    }
                }
                else{
                    await order.save()
                }
                return Promise.resolve('Sample Finished,Approved and activated order')
            case 'Failed':
                if(order.sample.sampleStatus=='Pending'||order.sample.sampleStatus=='Failed'||order.sample.sampleStatus=='Cancelled'){
                    return Promise.reject('Invalid: A pending failed or cancelled order')
                }
                order.sample.sampleStatus = 'Failed'
                order.status = 'Pending'
                order.sampleApproved = false
                order.sample.completionVerified.push({verifiedBy:user._id,verifiedAt:new Date()})
                if(order.subOrder){
                    await order.save()
                    let mainOrder = await Order.findOne({subOrders:order._id}).populate('subOrders')
                    mainOrder.subOrders.map((ele)=>{
                        if(ele.sample.sampleStatus=='Failed'&&ele.sample.completionVerified.length!=0){
                            total = total +1
                        }
                        else{
                            console.log(ele.sample.sampleStatus,'Not applicable for the order')
                        }
                    })
                    if(mainOrder.subOrders.length==total){
                        mainOrder.sample.sampleStatus = 'Failed'
                        mainOrder.status = 'Pending'
                        mainOrder.sampleApproved = false
                        mainOrder.sample.completionVerified.push({verifiedBy:user._id,verifiedAt:new Date()})
                        await mainOrder.save()
                    }
                }
                else{
                    await order.save()
                }
                return Promise.resolve('Sampling Failed. Repeat supplier processing.')
            case 'Reset':
                if(order.sample.sampleStatus!='Failed'&&order.sample.sampleStatus!='Cancelled'){
                    return Promise.reject('Not a failed or cancelled sample order')
                }
                order.sample.sampleStatus = 'Active'
                if(order.subOrder){
                    await order.save()
                    let mainOrder = await Order.findOne({subOrders:order._id}).populate('subOrders')
                    mainOrder.subOrders.map((ele)=>{
                        if(ele.sample.sampleStatus=='Failed'&&ele.sample.completionVerified.length!=0){
                            total = total +1
                        }
                        else{
                            console.log(ele.sample.sampleStatus,'Not applicable for the order')
                        }
                    })
                    if(mainOrder.subOrders.length==total){
                        mainOrder.sample.sampleStatus = 'Failed'
                        mainOrder.status = 'Pending'
                        mainOrder.sampleApproved = false
                        mainOrder.sample.completionVerified.push({verifiedBy:user._id,verifiedAt:new Date()})
                        await mainOrder.save()
                    }
                }
                else{
                    await order.save()
                }
                return Promise.resolve('Sample Status Resetted')
            default:
                return Promise.reject('Invalid Request type')
        }
    }
    catch(e){
        console.log(e)
        return Promise.reject('Invalid Request')
    }
}

orderSchema.statics.hostPayment = async function({id,user,details}){
    const Order = this
    console.log(details)

    try{
        const order = await Order.findById(id)
        if(order.subOrders.length!==0||(order.paymentStatus.value!=='Completed'&&order.paymentStatus.value!=='Contract'&&order.paymentStatus.value!=='Finished'&&order.sampleApproved!=true)){
            return Promise.reject('Not available for this order')
        }

        if(details.statusPayment!='Finished'){
            order.paymentStatus.hostPayment = details.type=='LC'?'Contract':'Completed'
            order.paymentStatus.transaction.push({info:details.type,status:'Successful',paymentType:'Admin Created',createdBy:user._id})
            if(order.subOrder){
                await order.save()
                const mainOrder = await Order.findOne({subOrders:id}).populate('subOrders')
                const payment = {
                    Completed:0,
                    Contract:0
                }
                mainOrder.subOrders.map((ele)=>{
                    if(ele.subOrders.paymentStatus.hostPayment=='Completed'||ele.subOrders.paymentStatus.hostPayment=='Contract'){
                        payment[ele.subOrders.paymentStatus.hostPayment] ++
                    }
                    else if(ele.subOrders.paymentStatus.hostPayment=='Finished'){
                        payment.Contract!=0?payment.Contract++:payment.Completed++
                    }
                })
                if(payment.Completed==mainOrder.subOrders.length||payment.Contract==mainOrder.subOrders.length||(payment.Contract+payment.Completed)==mainOrder.subOrders.length){
                    switch(mainOrder.subOrders.length){
                        case payment.Completed:
                            mainOrder.paymentStatus.hostPayment = 'Completed'
                            break;
                        case payment.Contract:
                            mainOrder.paymentStatus.hostPayment = 'Contract'
                            break;
                        case (payment.Completed+payment.Contract):
                            mainOrder.paymentStatus.hostPayment = 'Contract'
                            break;
                        default:
                            return Promise.reject()
                    }
                    await mainOrder.save()
                }
            }
            else{
                await order.save()
            }
        }
        else{
            order.paymentStatus.hostPayment = 'Finished'
            order.paymentStatus.transaction.push({info:'Finished',status:'Successful',paymentType:'Admin Created',createdBy:user._id})
            if(order.subOrder){
                await order.save()
                const mainOrder = await Order.findOne({subOrders:id}).populate('subOrders')
                const payment = 0
                mainOrder.subOrders.map((ele)=>{
                    if(ele.subOrders.paymentStatus.hostPayment=='Completed'||ele.subOrders.paymentStatus.hostPayment=='Contract'||ele.subOrders.paymentStatus.hostPayment=='Finished'){
                        payment++
                    }
                })
                if(payment==mainOrder.subOrders.length){
                    await mainOrder.save()
                }
            }
            else{
                await order.save()
            }
        }
    }
    catch(e){
        console.log(e)
        return Promise.reject('Error')
    }
}

orderSchema.statics.contractFinished = async (id,user) => {

    try{
        const res = await Order.updateOne({_id:id,'paymentStatus.value':'Contract',sampleApproved:true},{$set:{'paymentStatus.value':'Finished'}})
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