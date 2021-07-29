const mongoose = require('mongoose')
const pick = require('lodash/pick')
const Type = require('./type')

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

/* Creates a new category */

categorySchema.statics.createCat = async function(user,body){
    const Category = this

    try{
        let values = pick(body,['title','hscode'])
        
        const type = await Type.findById(body.type).lean()
        if(!type){
            return Promise.reject({status:false,message:'Type not found',statusCode:403})
        }

        values = {...values,'createdBy':user._id,type:type}

        const category = new Category(values)

        await category.save()
        return Promise.resolve(category)
    }
    catch(e){
        return Promise.reject(e)
    }
}

/* Function to edit category */

categorySchema.statics.editCat = async function(id,body,user,Work){
    const Category = this

    try{
        const type = await Type.findById(body.type).lean()
        const category = await Category.findByIdAndUpdate(id,{ $set: {title:body.title,hscode:body.hscode,type:type}, $addToSet:{modified:{modifiedBy:user}} },{new:true, runValidators:true})
        if(!category){
            return Promise.reject({status:false,message:'Category not found',statusCode:404})
        }
        await Work.updateMany({'category._id':id},{'category._id':id,'category.title':body.title,'category.hscode':body.hscode,'category.type':body.type})
        return Promise.resolve(category)
    }
    catch(e){
        return Promise.reject(e)
    }
}

const Category = mongoose.model('Category',categorySchema)

module.exports = Category
