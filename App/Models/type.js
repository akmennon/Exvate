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

typeSchema.statics.createType = async function(user,title,hscode){
    const Type = this

    try{
        const type = new Type({title,hscode,createdBy:user._id})

        await type.save()
        return Promise.resolve(type)
    }
    catch(e){
        return Promise.reject(err)
    }
}

/* function to edit type */

typeSchema.statics.editType = async function(id,title,hscode,user,Work){
    const Type = this

    try{
        const type = await Type.findByIdAndUpdate(id,{ $set: {title:title,hscode:hscode}, $addToSet:{modified:{modifiedBy:user}} },{new:true, runValidators:true})
        if(!type){
            return Promise.reject({status:false,message:'Type not found',statusCode:404})
        }
        await Work.updateMany({'type._id':id},{'type.title':title,'type.hscode':hscode})
        return Promise.resolve(type)
    }
    catch(e){
        return Promise.reject('Type not found', err)
    }
}

const Type = mongoose.model('Type',typeSchema)

module.exports = Type