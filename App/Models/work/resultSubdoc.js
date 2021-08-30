const mongoose = require('mongoose')

const Schema = mongoose.Schema

const resultSchema = new Schema({
    orderId:{
        type:Schema.Types.ObjectId
    },
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
    calc:[
        {
            method:{
                type:String
            },
            keys:[{type:Number}],
            calcValues:[{type:Number}]
        }
    ],
    sampleAvailable:{
        type:Boolean,
        default:true
    }
})

const Result = mongoose.model('Result',resultSchema)

module.exports = Result