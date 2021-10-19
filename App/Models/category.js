const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema({
    title:{
        type:String,
        maxlength:40,
        minlength:2,
        required:true
    },
    type:{
        _id:{
            type:Schema.Types.ObjectId,
            required:true,
            ref:'Type'
        },
        title:{
            type:String,
            maxlength:40,
            minlength:2
        },
        hscode:{
            type:String,
            minlength:2,
            maxlength:2
        }
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    hscode:{
        type:String,
        minlength:4,
        maxlength:4
    },
    createdAt:{
        type:Date,
        default:Date.now
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

const Category = mongoose.model('Category',categorySchema)

module.exports = Category
