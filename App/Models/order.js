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
        name:{
            type:String,
            maxlength:40,
            minlength:3
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

        if(work.status != 'Available'){
            return Promise.reject({status:false,message:'Service unavailable',statusCode:403})
        }

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

            const userAddress = user.address.find((ele)=>{
                return ele._id = orderValues.address
            })
            order.address = userAddress
            order.billingAddress = userAddress

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

            order.result = result
            order.status = 'Pending'
            order.userId = user
            order.workId = work
            const userAddress = user.address.find((ele)=>{
                return ele._id = orderValues.address
            })
            order.address = userAddress
            order.billingAddress = userAddress

            /* Order is modelled with result and saved */
            await order.save()
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
        const mainOrder = await Order.findById(id).lean()
        if(mainOrder.userId._id==user._id){
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

orderSchema.statics.userAll = async function(id,user){
    const Order = this

    try{
        const orders = await Order.find({'userId._id':user.id}).sort({createdAt:-1}).limit(20).lean()
        console.log(orders)
        return Promise.resolve(orders)
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

const Order = mongoose.model('Order',orderSchema)

module.exports = Order