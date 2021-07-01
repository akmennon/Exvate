const mongoose = require('mongoose')

const Schema = mongoose.Schema

const optionSchema = new Schema({
    workId:{
        type:Schema.Types.ObjectId,
        ref:'Work'
    },
    workTitle:{
        type:String
    },
    userWork:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    params:[{
        optionType:{
            type:String
        },
        tierType:{
            type:Boolean,
            default:false
        },
        unit:{
            type:String
        },
        values:[{
            min:{
                type:Number
            },
            max:{
                type:Number
            },
            value:{
                type:Number
            },
            label:{
                type:String
            },
            desc:{
                type:String
            },
            time:{
                type:Number
            },
            initial:{
                type:Boolean
            },
            amount:{
                type:Boolean
            }
        }],
        title:{
            type:String
        },
        desc:{
            type:String
        },
        checkbox:{
            value:{
                type:Boolean
            },
            trueValue:{
                value:{
                    type:Number
                }
            },
            title:{
                type:String
            },
            desc:{
                type:String
            }
        }
    }]
})
const Option = mongoose.model('Option', optionSchema)

module.exports = Option