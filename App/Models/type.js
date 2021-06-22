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

/* Creates a new type */

typeSchema.statics.createType = function(user,title,hscode){
    const Type = this

    const type = new Type({title,hscode,createdBy:user._id})
    if(!user.isAdmin){
        return Promise.reject('Invalid attempt')
    }

    return type.save()
        .then(function(type){
            return Promise.resolve(type)
        })
        .catch(function(err){
            return Promise.reject(err)
        })
}

/* function to edit type */

typeSchema.statics.editType = function(id,title,hscode,user){
    const Type = this

    return Type.findByIdAndUpdate(id,{ $set: {title:title,hscode:hscode}, $addToSet:{modified:{modifiedBy:user}} },{new:true, runValidators:true})
                .then(function(type){
                    return type.save()
                })
                .then((type)=>{
                    return Promise.resolve(type)
                })
                .catch(function(err){
                    return Promise.reject('Type not found', err)
                })
}

const Type = mongoose.model('Type',typeSchema)

module.exports = Type