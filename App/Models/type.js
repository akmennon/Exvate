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

const Type = mongoose.model('Type',typeSchema)

module.exports = Type