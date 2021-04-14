const mongoose = require('mongoose')

const Schema = mongoose.Schema

const resultSchema = new Schema({
    orderId:{
        type:Schema.Types.ObjectId
    },
    result:[{
        _id:false,
        workId:{
            type:Schema.Types.ObjectId,
            ref:'work',
            required:true
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
        preValues:[{
            workId:{
                type:String
            },
            prevKey:{
                type:Number
            }
        }],
        calc:[
            {
                method:{
                    type:String
                },
                keys:[{type:Number}],
                calcValues:[{type:Number}]
            }
        ],
        sampleValues:{
            available:{
                type:Boolean
            },
            price:{
                type:Number
            },
            time:{
                type:Number
            },
            amount:{
                type:Number
            },
            required:{
                type:Boolean
            }
        }
    }]
})

const Result = mongoose.model('Result',resultSchema)

module.exports = Result