const mongoose = require('mongoose')

const Schema = mongoose.Schema

const typeSchema = new Schema({
    title:{
        type:String,
        maxlength:40,
        minlength:2
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    hscode:{
        type:String,
        minlength:2,
        maxlength:2
    },
    modified:[{
        modifiedBy:{
            type:Schema.Types.ObjectId,
            ref:'User'
        },
        modifiedAt:{
            type:Date,
            default:Date.now
        }
    }]
})

typeSchema.statics.findAll = async function(body){
    const Type = this

    try{
        const types = await Type.aggregate([
            {
                $facet:{
                    types:[
                        {
                            $skip:body.skip||0
                        },
                        {
                            $limit:/*body.limit<20?body.limit:*/10
                        }
                    ],
                    count:[
                        {
                            $count:'count'
                        }
                    ]
                }
            }
        ]).cache({hashKey:path,pathValue:JSON.stringify(body.skip)||'0'})

        return Promise.resolve({types:types[0].types,count:types[0].count[0]?types[0].count[0].count:0})
    }
    catch(e){
        return Promise.reject(e)
    }
}

const Type = mongoose.model('Type',typeSchema)

module.exports = Type