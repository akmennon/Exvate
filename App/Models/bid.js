const mongoose = require('mongoose')

const Schema = mongoose.Schema

const bidSchema = new Schema({
    user:{
        name:{
            type:String,
            required:true,
            maxlength:60,
            minlength:2
        },
        email:{
            type:String,
            requried:true,
            maxlength:80,
            minlength:5
        },
        mobile:{
            type:String,
            requried:true,
            maxlength:30,
            minlength:4
        },
        userId:{
            type:Schema.Types.ObjectId,
            ref:'User',
            required:true
        }
    },
    orderId:{
        type:Schema.Types.ObjectId,
        ref:'Order',
        required:true
    },
    price:{
        type:Number,
        min:1,
        max:1000000000,
        required:true
    },
    status:{
        type:String,
        validation:function(value){
            switch(value){
                case 'Active':
                    return true
                case 'Accepted':
                    return true
                case 'Rejected':
                    return true
                case 'Finished':
                    return true
                default:
                    return false
            }
        }
    },
    removed:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

bidSchema.statics.createBid = async function(orderId,price,user,Order){
    const Bid = this

    try{

        const existingBids = await Bid.aggregate([
            {
                $match:{
                    orderId,
                    'user.userId':mongoose.Types.ObjectId(user._id.toString()),
                    status:{
                        $ne:'Rejected'
                    }
                }
            },
            {
                $project:{
                    status:1,
                    removed:1,
                    _id:0
                }
            }
        ])

        if(existingBids.length>=2){
            return Promise.reject({status:false,message:'Can only bid twice for an order',statusCode:403})
        }

        if(existingBids.find((bid)=>bid.status=='Active'&&bid.removed==false)){
            return Promise.reject({status:false,message:'Active bid already exists',statusCode:403})
        }

        const order = await Order.findOne({_id:orderId,'userId._id':{$ne:user._id}},{_id:0,biddingDuration:1,biddingStatus:1}).lean()

        if(!order){
            return Promise.reject({status:false,message:'Order not found',statusCode:403})
        }

        if(new Date(order.biddingDuration).getTime()<new Date().getTime()||order.biddingStatus=='Closed'){
            return Promise.reject({status:false,message:'Bidding is closed for the order',statusCode:403})
        }

        const bid = new Bid({
            user:{
                name:user.name,
                email:user.email.email,
                mobile:user.mobile,
                userId:user._id
            },
            orderId,
            price
        })

        await bid.save()

        return Promise.resolve({status:true,message:'Bid has been successfully created for the order'})
    }
    catch(e){
        return Promise.reject(e)
    }
}

bidSchema.statics.userList = async function(user,body){
    const Bid = this

    try{
        const bids = await Bid.aggregate([
            {
                $match:{
                    user:{
                        userId:mongoose.Types.ObjectId(user._id.toString())
                    },
                    removed:false
                }
            },
            {
                $project:{
                    orderId:1,
                    price:1,
                    status:1,
                    createdAt:1,
                    sortValue:{
                        $switch: {
                            branches: [
                            { case: 'Active', then: 1 },
                            { case: 'Accepted', then: 1 },
                            { case: 'Rejected', then: 2 },
                            { case: 'Finished', then: 2 }
                            ],
                            default: 2
                        }
                    }
                }
            },
            {
                $facet:{
                    bids:[
                        {
                            $sort:{
                                sortValue:1
                            }
                        },
                        {
                            $skip:body.skip||0
                        },
                        {
                            $limit:body.limit&&body.limit<20?body.limit:10
                        }
                    ],
                    count:[
                        {
                            $count:'count'
                        }
                    ]
                }
            }
        ])

        return Promise.resolve(bids)
    }
    catch(e){
        return Promise.reject(e)
    }
}

bidSchema.statics.removeBid = async function(user,bidId){
    const Bid = this

    try {
        const result = await Bid.updateOne({user:{userId:user._id},_id:bidId},{removed:true})

        if(result.nModified){
            return Promise.resolve({status:true,message:'Successfully removed bid'})
        }
        else{
            return Promise.reject({status:false,message:'Error removing bid',statusCode:500})
        }
    }
    catch(e){
        return Promise.reject(e)
    }
}

bidSchema.statics.deleteOldBids = async function(user){
    const Bid = this

    try{
        const response = await Bid.deleteMany({'user.userId':user._id.toString(),status:'Rejected'})

        return Promise.resolve(`${response.deletedCount} deleted`)
    }
    catch(e){
        return Promise.reject(e)
    }
}

const Bid = mongoose.model('Bid',bidSchema)

module.exports = Bid