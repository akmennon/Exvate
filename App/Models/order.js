const mongoose = require('mongoose')
const Result = require('./work/resultSubdoc')
const pick = require('lodash/pick')
const sendMail = require('../Resolvers/sendMail')
const Validator = require('validator')

/* Resolver which calculates the price and time */
const calcResult = require('../Resolvers/calcResult')
const Work = require('./work/work')

const Schema = mongoose.Schema

const orderSchema = new Schema({
    workId:{                                
        _id:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'Work'
        },
        title:{
            type:String,
            maxlength:40,
            minlength:2,
            required:true
        }
    },
    userId:{
        _id:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'User'
        },
        name:{
            type:String,
            required:true,
            maxlength:30,
            minlength:3
        },
        email:{
            email:{
                type:String,
                required:true,
                validate:{
                    validator:function(value){
                        return Validator.isEmail(value)
                    },
                    message:function(){
                        return 'Invalid Email'
                    }
                }
            },
            confirmed:{
                token:{             //Token for email confirmation
                    type:String
                },
                value:{             //The value to verify that the email has been confimed
                    type:Boolean
                }
            }
        },
        mobile:{
            type:String,
            maxlength:20
        }
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
          },
          tierType:{
              type:Boolean
          },
          label:{
              type:String
          }
        }]
    },
    address:{
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
    },
    billingAddress:{
        name:{
            type:String,
            maxlength:40,
            minlength:3
        },
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
    },
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
    orderType:{
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
        },
        default:'Order'
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
        },
        default:'Exworks'
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
                        case 'Cancelled':
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
                        case 'Cancelled':
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
        supplierAmountPaid:{
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
                            case 'Advance/LC':
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
            },
            advancePercent:{
                type:Number,
                min:1,
                max:99
            }
        }]
    },
    pl:{
        currentPL:{
            type:Number
        },
        totalPL:{
            type:Number
        },
        currentPayment:{
            type:Number
        },
        advancePercent:{
            type:Number
        },
        charges:[
            {
                chargeType:{
                    type:String,
                    validate:{
                        validator:function(val){
                            switch(val){
                                case 'Shipping':
                                    return true
                                case 'Insurance':
                                    return true
                                case 'Inspection':
                                    return true
                                case 'Sourcing':
                                    return true
                                case 'Return':
                                    return true
                                case 'Other':
                                    return true
                                default:
                                    return false
                            }
                        },
                        message:function(){
                            return 'Invalid charge type'
                        }
                    }
                },
                otherDetails:{
                    type:String,
                    maxlength:40
                },
                entity:{
                    type:String,
                    validate:{
                        validator:function(val){
                            switch(val){
                                case 'Bank':
                                    return true
                                case 'Company':
                                    return true
                                case 'Gov':
                                    return true
                                default:
                                    return false
                            }
                        },
                        message:function(){
                            return 'Invalid entity type'
                        }
                    }
                },
                entityName:{
                    type:String,
                    maxlength:40
                },
                price:{
                    type:Number,
                    min:0
                },
                contactName:{
                    type:String,
                    maxlength:40
                },
                contactNumber:{
                    type:String,
                    minlength:6,
                    maxlength:20
                },
                transactionId:{
                    type:String,
                    maxlength:120,
                    minlength:3
                },
                paymentDate:{
                    type:Date
                },
                paymentMethod:{
                    type:String,
                    validate:{
                        validator:function(val){
                            switch(val){
                                case 'Online Transfer':
                                    return true
                                case 'Cash Payment':
                                    return true
                                case 'LC':
                                    return true
                                default:
                                    return false
                            }
                        },
                        message:function(){
                            return 'Invalid payment method'
                        }
                    }  
                },
                createdAt:{
                    type:Date,
                    default:Date.now
                }
            }
        ]
    },
    result:{
        _id:{
            type:Schema.Types.ObjectId,
            ref:'Result'
        },
        values:[{
            type:Number
        }],
        time:{
            values:[{
                type:Number
            }],
            calc:[{
                method:{
                    type:String
                },
                keys:[{type:Number}],
                calcValues:[{type:Number}]  
            }]
        },
        calc:[
            {
                method:{
                    type:String
                },
                keys:[{type:Number}],
                calcValues:[{type:Number}]
            }
        ]
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
orderSchema.statics.createOrder = async function(orderValues,id,user){
    const Order = this

    try{
        const work = await Work.findById(id).lean()
        const resultValue = work.result
        resultValue.workId = work._id
        const option = work.options

        if(orderValues.orderType&&orderValues.orderType=='sample'){

            if(work.result.sampleAvailable==false){
                return Promise.reject({status:false,message:'Sampling not available',statusCode:403})
            }

            if(work._id.toString() != orderValues.result.workId){
                return Promise.reject({status:false,message:'Error creating order',statusCode:500})
            }

            if(user.sampleOrders.includes(id)){
                return Promise.reject({status:false,message:'Already ordered a sample',statusCode:403})
            }
            
            if((user.sampleOrders.length+1)>user.perms.user.sample.max){
                return Promise.reject({status:false,message:'Sample limit reached',statusCode:403})
            }

            let orderFinal = {
                userId:user._id,
                workId:id,
                values:{
                    variables:[]
                }
            }

            option.params.map((ele,index)=>{
                orderFinal.values.variables[index] = {title:ele.title},
                orderFinal.values.variables[index].unit = ele.unit
                orderFinal.values.variables[index].value = orderValues.result.values[index]
                if(ele.tierType){
                    orderFinal.values.variables[index].tierType = true
                    const value = ele.values.find((elem)=>{
                        return elem.value === orderValues.result.values[index]
                    })
                    orderFinal.values.variables[index].label = value.label
                }
                else{
                    orderFinal.values.variables[index].tierType = false
                }
            })

            orderFinal.values = {...orderFinal.values,price:1,time:1}

            const order = new Order(orderFinal)

            order.status = 'Pending'
            order.userId = user
            order.workId = work
            order.orderType = 'Sample'
            order.address = user.address.find((ele)=>{
                return ele._id = orderValues.address
            })

            if(orderValues.billingAddress){
                const billingAddress = pick(orderValues.billingAddress,['name','building','street','city','state','country','pin'])
                for(const x in billingAddress){
                    if(!x){
                        return Promise.reject({status:false,message:'Invalid input',statusCode:403})
                    }
                }
                order.billingAddress = billingAddress
            }
            else{
                order.billingAddress = user.address.find((ele)=>{
                    return ele._id = orderValues.address
                })
            }

            /* Order is modelled with result and saved */
            await order.save()
            user.sampleOrders.push(id)
            await user.save()
        }
        else{
            
            /* workIds of frontend result and db result is matched
                    and the values are saved to the db result
             */
    
            if(work._id.toString() == orderValues.result.workId){
                resultValue.values = orderValues.result.values
                resultValue.time.values = orderValues.result.time.values
            }
            else{
                return Promise.reject({status:false,message:'Error creating order',statusCode:403})
            }
    
            let output = calcResult(resultValue) /*[{workId:"",price:1,time:1,amount:1}]*/

            let orderFinal = {
                userId:user._id,
                workId:id,
                orderType:'Order',
                values:{
                    variables:[]
                }
            }

            /* Variables are chosen from the backend and not from the frontend */
            option.params.map((ele,index)=>{
                orderFinal.values.variables[index] = {title:ele.title},
                orderFinal.values.variables[index].unit = ele.unit
                orderFinal.values.variables[index].value = resultValue.values[index]
                if(ele.tierType){
                    orderFinal.values.variables[index].tierType = true
                    const value = ele.values.find((elem)=>{
                        return elem.value === resultValue.values[index]
                    })
                    orderFinal.values.variables[index].label = value.label
                }
                else{
                    orderFinal.values.variables[index].tierType = false
                }
            })

            /* since only one work is present */
            let value = pick(output[0],['time','price'])
            orderFinal.values = {...orderFinal.values,...value}

            const order = new Order(orderFinal)

            /* Result is modelled and saved */
            delete resultValue._id
            const result = new Result({...resultValue,orderId:order._id})
            const savedResult = await result.save()

            order.result = savedResult
            order.status = 'Pending'
            order.userId = user
            order.workId = work
            order.address = user.address.find((ele)=>{
                return ele._id = orderValues.address
            })

            if(orderValues.billingAddress){
                const billingAddress = pick(orderValues.billingAddress,['name','building','street','city','state','country','pin'])
                for(const x in billingAddress){
                    if(!x){
                        return Promise.reject({status:false,message:'Invalid input',statusCode:403})
                    }
                }
                order.billingAddress = billingAddress
            }
            else{
                order.billingAddress = user.address.find((ele)=>{
                    return ele._id = orderValues.address
                })
            }

            /* Order is modelled with result and saved */
            const savedOrder = await order.save()

            await user.saveOrder(savedOrder)
        }

        return Promise.resolve({status:true,message:'Order Created Successfully',statusCode:201})
    }
    catch(e){
        console.log(e)
        return Promise.reject(e)
    }
}

/* Provides the entire details of an order */
orderSchema.statics.orderDetails = async function(id,user){
    const Order = this

    /* Checks if the order is present in the user */
    
    try{
        if(user.orders.includes(id)||user.isAdmin.value){
            /* Lean should not be used */
            let mainOrder = await Order.findById(id).lean()
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
        const order = await Order.find(filter).skip(query.range[0]).limit(limit).sort({createdAt:-1})
        const count = await Order.countDocuments(filter)
        return Promise.resolve({order,count,query})
    }
    catch(e){
        return Promise.reject(e)
    }
}

/* Verifies the order */
orderSchema.statics.verifyOrder = async function(id,body,user,User){
    const Order = this
    
    try{
        const verifiedValues = pick(body,['values','supplier']) //Validation required (Pick)

        let order = await Order.findById(id)

        //Verification is invalid for drafts or failed orders
        if(order.status=='Draft'||order.status == 'Failed'){
            return Promise.reject({status:false,message:'Order not valid for verification',statusCode:401})
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

        let text

        if(order.orderType=='Sample'){
            if(order.values.price==0){
                text = 'Your sample order has been processed and will be dispatched shortly'
                order.paymentStatus.value = 'Completed'
                order.status = 'Active'
                order.pl = {
                    currentPL:0,
                    currentPayment:0,
                    totalPL:0
                }
                const now = new Date()
                order.deadline = now.setDate(now.getDate()+3*7)
                order.paymentStatus.transaction = {
                    paymentType:'No payment',
                    createdBy:user._id,
                    createdAt:new Date()
                }
                if(order.paymentStatus.supplierPayment==0){
                    order.paymentStatus.supplierPayment = 'Completed'
                    order.paymentStatus.transaction.push({
                        info:'details.type',
                        status:'Successful',
                        paymentType:'Supplier payment',
                        method:'Admin Created',
                        createdBy:user._id
                    })
                }
            }
            else{
                text = 'The sampling price has been updated and is ready for payment'
            }
        }
        else{
            text = order.values.price>90000?`The order prices have been updated and is ready for payment. The Bank details shall be provided shortly`:`The order prices have been updated and is ready for payment. Please use the website to make payment`
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
            text: text
            /*html: "<b>Hello world?</b>"*/ // html body
        }
        const mail = await sendMail(mailData)

        return Promise.resolve({status:true,message:'Verified sucessfully'})
    }
    catch(e){
        return Promise.reject(e)
    }
}

orderSchema.statics.paymentConfirm = async function({id,user,details}){
    const Order = this

    try{
        const order = await Order.findById(id)

        if(order.status!='Pending'&&order.verified.value){
            return Promise.reject({status:false,message:'Not applicable for the order',statusCode:403})
        }

        if(order.orderType=='Sample'&&details.type!='Advance'){
            return Promise.reject({status:false,message:'Invalid sample payment option',statusCode:403})
        }

        const date = new Date()
        
        if(order.validTill.getTime()<date.getTime()&&order.orderType!='Sample'){
            return Promise.reject({status:false,message:'Order validity passed. Order needs to be validated again before confirmation',statusCode:403})
        }

        const transaction = {//should be changed according to transaction
            paymentType:details.type,
            createdBy:user._id,
            createdAt:new Date()
        }

        const deadline = new Date(details.deadline)

        if(details.type=='LC'){
            const pl = {
                currentPL:0,
                currentPayment:0,
                totalPL:order.values.price
            }

            await Order.updateOne({_id:id},{'paymentStatus.value':'Contract',status:'Active',pl,deadline:deadline,$push:{'paymentStatus.transaction':transaction}})
        }
        else if (details.type=='Advance'){
            const pl = {
                currentPL:order.values.price,
                currentPayment:order.values.price,
                totalPL:order.values.price
            }

            await Order.updateOne({_id:id},{'paymentStatus.value':'Completed',status:'Active',pl,deadline:deadline,$push:{'paymentStatus.transaction':transaction}})
        }
        else if(details.type=='Advance/LC'){
            if(details.advancePercent<=0||details.advancePercent>95){
                return Promise.reject({status:false,message:'Invalid input for advance',statusCode:403})
            }

            const pl = {
                currentPayment:(Number(details.advancePercent)*order.values.price)/100,
                totalPL:order.values.price,
                advancePercent:details.advancePercent
            }
            pl.currentPL = pl.currentPayment
            
            await Order.updateOne({_id:id},{'paymentStatus.value':'Contract',status:'Active',pl,deadline:deadline,$push:{'paymentStatus.transaction':transaction}})
        }
        else{
            return Promise.reject({status:false,message:'Error payment option',statusCode:422})
        }

        const mailData = {
            from: '"Sourceo" <ajaydragonballz@gmail.com>',
            to: order.userId.email.email, // list of receivers
            subject: "Payment Completed",
            text: `The payment has been confirmed.`
        }

        await sendMail(mailData)
        return Promise.resolve({status:true,message:'Payment has been confirmed. The order shall be made to be shipped shortly.'})
    }
    catch(e){
        console.log(e)
        return Promise.reject(e)
    }
}


orderSchema.statics.refundComplete = async function(id,user){
    const Order = this

    try{
        let order = await Order.findById(id)

        if(!order.verified.value||order.paymentStatus.value!='Completed'){
            return Promise.reject({status:false,message:'Order not applicable for a refund',statusCode:403})
        }

        if(order.status!='Cancelled'&&order.cancelVerified.length!=0){
            return Promise.reject({status:false,message:'Order not cancelled for a refund',statusCode:403})
        }

        order.paymentStatus.value = 'Refunded'
        if(order.paymentStatus.supplierPayment=='Pending'){
            order.paymentStatus.supplierPayment='Cancelled'
        }

        order.paymentStatus.transaction.push({paymentType:'External',createdBy:user._id})
        order.completionVerified.push({verifiedBy:user._id})
        order = await order.save()
        return order
    }
    catch(e){
        console.log(e)
        return Promise.reject(e)
    }
}

orderSchema.statics.userAll = async function(id,user){
    const Order = this

    try{
        if(user.isAdmin.value){
            const orders = await Order.find({'userId._id':id}).sort({createdAt:-1}).limit(20).lean() //proper pagination required
            console.log(orders)
            return Promise.resolve(orders)
        }
        else{
            const orders = await Order.find({'userId._id':user.id}).sort({createdAt:-1}).limit(20).lean()
            console.log(orders)
            return Promise.resolve(orders)
        }
    }
    catch(e){
        console.log(e)
        return Promise.reject(e)
    }
}

/* Pending */
orderSchema.statics.dashBoard = async function(user){
    const Order = this

    try{
        const unverified = await Order.find({'verified.value':false}).sort({createdAt:'desc'}).limit(10)
        console.log(unverified)
        const paid = await Order.find({'paymentStatus.value':'Completed'}).sort({'paymentStatus.transaction.createdAt':'desc'}).limit(10)
    }
    catch(e){
        console.log(e)
        return Promise.reject(e)
    }
}

orderSchema.statics.orderFns = async function(id,type,user,details,User){
    const Order = this

    if(!id||!type||!user.isAdmin.value){
        return Promise.reject({status:false,message:'Invalid action',statusCode:403})
    }

    console.log(type)

    try{

        const order = await Order.findById(id)

        if(type!='cancel'&&(!order.verified.value||(order.paymentStatus.value!='Completed'&&order.paymentStatus.value!='Contract'&&order.paymentStatus.value!='Finished'))){
            return Promise.reject({status:false,message:'Not an approved order',statusCode:403})
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
                    if(order.status=='Completed'){
                        return Promise.reject({status:false,message:'Already Completed',statusCode:403})
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
                    return Promise.resolve({status:true,message:'Order completed'})
                }
            }

            case 'shipped': {

                if(order.status!='Active'){
                    return Promise.reject({status:false,message:'Not an active order',statusCode:403})
                }
                if(order.status=='Transit'){
                    return Promise.reject({status:false,message:'Already Shipped',statusCode:403})
                }

                for(const x in details){ //removal of unwanted inputs -- to be moved to validation of inputs
                    if(!details[x]){
                        delete details[x]
                    }
                }
                order.status = 'Transit'
                order.shipmentDetails = details
                await order.save()
                return Promise.resolve({status:true,message:'Order Shipped'})
            }

            case 'finish':  {

                if(order.status!='Completed' || order.paymentStatus.supplierPayment!='Finished'){
                    return Promise.reject({status:false,message:'Not Completed/ Supplier payment pending',statusCode:403})
                }
                if(order.status=='Finished'){
                    return Promise.reject({status:false,message:'Already Finished',statusCode:403})
                }
                order.pl.currentPL = order.pl.totalPL
                order.status = 'Finished'
                order.completionVerified.push({verifiedAt:new Date(),verifiedBy:user._id})
                User.supplierWorkComplete(order.supplier.assigned[0],order._id)
                await order.save()
                return Promise.resolve({status:true,message:'Order completed'})
            }
                
            case 'cancel': {

                if(order.status=='Completed'||order.status=='Transit'||order.status=='Finished'||order.paymentStatus.value=='Contract'){
                    return Promise.reject({status:false,message:'Not applicable for the order',statusCode:403})
                }
                if(order.status=='Cancelled'){
                    return Promise.reject({status:false,message:'Already Cancelled',statusCode:403})
                }
                if(order.paymentStatus.supplierPayment == 'Completed' || order.paymentStatus.supplierPayment == 'Contract' || order.paymentStatus.supplierPayment == 'Finished'){
                    return Promise.reject({status:false,message:'Supplier Already paid',statusCode:403})
                }

                /* executed only when no payment is made */
                if(order.status == 'Pending'){
                    order.paymentStatus.value = 'Cancelled'
                    order.completionVerified.push({verifiedBy:user._id})
                }

                if(!order.orderType=='Sample'||order.paymentStatus.supplierAmount!=0){
                    order.paymentStatus.supplierPayment = 'Cancelled'
                }

                if(order.orderType=='Sample'){
                    await User.updateOne({_id:order.userId._id},{$pull:{'sampleOrders':order._id}})
                }

                order.status = 'Cancelled'
                order.cancelVerified.push({verifiedBy:user._id})

                if(order.supplier.assigned[0]){
                    await User.supplierWorkComplete(order.supplier.assigned[0],order._id)
                    order.supplier.assigned = []
                }
                await order.save()
                return Promise.resolve({status:true,message:'Order Cancelled'})
            }

            case 'fail': { //Proper workflow required

                if(order.paymentStatus.value!='Contract'){
                    return Promise.reject({status:false,message:'Not a contract',statusCode:403})
                }
                if(order.status=='Completed'||order.status=='Finished'||order.status=='Failed'){
                    return Promise.reject({status:false,message:'Not applicable for the order',statusCode:403})
                }
                order.status = 'Failed'
                order.completionVerified.push({verifiedBy:user._id})
                order.pl.totalPL = order.pl.currentPL
                if(order.supplier.assigned[0]){
                    await User.supplierWorkComplete(order.supplier.assigned[0],order._id)
                    order.supplier.assigned = []
                }
                await order.save()
                return Promise.resolve({status:true,message:'Status changed successfully'})
            }

            default:
                return Promise.reject({status:false,message:'Invalid function type',statusCode:403})
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
        const order = details.type=='Advance/LC'||details.statusPayment=='Finished'? await Order.findById(id).populate('supplier.assigned') : await Order.findById(id)

        if(order.paymentStatus.value!=='Completed'&&order.paymentStatus.value!=='Contract'&&order.paymentStatus.value!=='Finished'){
            return Promise.reject({status:false,message:'Not available for this order',statusCode:403})
        }

        if(order.orderType=='Sample'&&details.statusPayment!='Finished'&&details.type!='Advance'){
            return Promise.reject({status:false,message:'Payment of this type not supported',statusCode:403})
        }

        if(details.statusPayment!='Finished'){
            order.paymentStatus.supplierPayment = details.type=='LC'||details.type=='Advance/LC'?'Contract':'Completed'
            let transactionDetails;
            if(details.type=='Advance/LC'){
                details.advancePercent = Number(details.advancePercent)
                if(details.advancePercent<1||details.advancePercent>99){
                    return Promise.reject({status:false,message:'Invalid advance percentage',statusCode:403})
                }

                transactionDetails = {
                    info:details.type,
                    status:'Successful',
                    paymentType:details.type,
                    method:'Admin Created',
                    createdBy:user._id,
                    advancePercent:details.advancePercent
                }
                const paidAmount = ((details.advancePercent/100) * order.paymentStatus.supplierAmount)
                order.paymentStatus.supplierAmountPaid = paidAmount
                order.pl.currentPL = order.pl.currentPL - paidAmount
                order.pl.totalPL = order.pl.totalPL - paidAmount
                order.pl.charges.push(
                    {
                        chargeType:'Sourcing',
                        entity:'Company',
                        entityName:order.supplier.assigned[0].companyDetails.name||'Company Name', //temporary until company details are needed to be a supplier
                        price:paidAmount,
                        contactName:order.supplier.assigned[0].name,
                        contactNumber:order.supplier.assigned[0].mobile,
                        transactionId:details.transactionId,
                        paymentDate:details.paymentDate,
                        paymentMethod:details.paymentMethod
                    }
                )
            }
            else{
                transactionDetails = {
                    info:details.type,
                    status:'Successful',
                    paymentType:'Supplier payment',
                    method:'Admin Created',
                    createdBy:user._id
                }
            }
            order.paymentStatus.transaction.push(transactionDetails)
            await order.save()
        }
        else{
            
            const paidAmount = order.paymentStatus.supplierAmountPaid ? order.paymentStatus.supplierAmount - order.paymentStatus.supplierAmountPaid : order.paymentStatus.supplierAmount
            order.pl.currentPL = order.pl.currentPL - paidAmount
            order.pl.totalPL = order.pl.totalPL - paidAmount
            order.paymentStatus.supplierAmountPaid = order.paymentStatus.supplierAmount
            order.pl.charges.push({
                chargeType:'Sourcing',
                entity:'Company',
                entityName:order.supplier.assigned[0].companyDetails.name||'Company Name', //temporary until company details are needed to be a supplier
                price:paidAmount,
                contactName:order.supplier.assigned[0].name,
                contactNumber:order.supplier.assigned[0].mobile,
                transactionId:'LC Id',
                paymentDate:Date.now(),
                paymentMethod:order.paymentStatus.supplierPayment=='Contract'?'LC':'Online Transfer'
            })

            order.paymentStatus.supplierPayment = 'Finished'

            order.paymentStatus.transaction.push({info:'Finished',status:'Successful',method:'Admin Created',paymentType:'Supplier payment',createdBy:user._id})
            await order.save()
            await User.supplierWorkComplete(order.supplier.assigned[0],order._id)
        }
    }
    catch(e){
        console.log(e)
        return Promise.reject(e)
    }
}

orderSchema.statics.contractFinished = async function(id,user,User){

    try{
        /* Checks if supplier is payment is also by contract, if it is. It is completed as well */
        const order = await Order.findOneAndUpdate({_id:id,'paymentStatus.value':'Contract'},[{$set:{'paymentStatus.value':'Finished','paymentStatus.supplierPayment':{$cond:[{$eq:['Contract','$paymentStatus.supplierPayment']},'Finished','$paymentStatus.supplierPayment']},'paymentStatus.transaction':{$concatArrays:['$paymentStatus.transaction',[{info:'Finished',status:'Successful',method:'Admin Created',createdBy:user._id}]]}}}],{new:true})
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

orderSchema.statics.orderCharges = async function(id,details){
    const Order = this

    try{
        const order = await Order.findById(id)

        details.price = Number(details.price)

        if(details.chargeType!='Return'){
            if(details.chargeType=='Other'&&!details.otherDetails){
                return Promise.reject({status:false,message:'Invalid request',statusCode:403})
            }
            order.pl.charges.push(details)
            order.pl.currentPL = order.pl.currentPL - details.price
            order.pl.totalPL = order.pl.totalPL - details.price
        }
        else{
            if(!details.otherDetails){
                return Promise.reject({status:false,message:'Invalid request',statusCode:403})
            }
            order.pl.charges.push(details)
            order.pl.currentPL = order.pl.currentPL + details.price
            order.pl.totalPL = order.pl.totalPL + details.price
        }

        await order.save()
        return Promise.resolve(order)
    }
    catch(e){
        return Promise.reject(e)
    }
}

orderSchema.statics.removeCharges = async function(id,chargeId){
    const Order = this

    try{
        const order = await Order.updateOne({_id:id},[    
            {
                $set:{
                    'chargePrice':{
                        $reduce:{
                            input:'$pl.charges',
                            initialValue:0,
                            in:{
                                $cond:[
                                    {
                                        $eq:[
                                            '$$this._id',{
                                                $toObjectId:chargeId
                                            }
                                        ]
                                    },
                                    '$$this.price',
                                    '$$value'
                                ]
                            }
                        }
                    }
                }
            },
            {
                $set:{
                    'pl.totalPL':{
                        $add:['$pl.totalPL','$chargePrice']
                    },
                    'pl.currentPL':{
                        $add:['$pl.currentPL','$chargePrice']
                    },
                    'pl.charges':{
                        $filter:{
                            input:'$pl.charges',
                            as:'charge',
                            cond:{
                                $ne:['$$charge._id',{ $toObjectId:chargeId }]
                            }
                        }
                    }
                }
            },
            {
                $unset:['chargePrice']
            }
        ])
        if(order.nModified!=0){
            return Promise.resolve({status:true,message:'Charge removed successfully',statusCode:200})
        }
        else{
            return Promise.reject({status:false,message:'Unsuccessful',statusCode:400})
        }
    }
    catch(e){
        return Promise.reject(e)
    }
}

const Order = mongoose.model('Order',orderSchema)

module.exports = Order