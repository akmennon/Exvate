const mongoose = require('mongoose')
const pick = require('lodash/pick')

const Schema = mongoose.Schema

const categorySchema = new Schema({
    title:{
        type:String,
        maxlength:40,
        minlength:2,
        required:true
    },
    type:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Type'
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User'
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

categorySchema.statics.createCat = function(user,body){
    if(!user.isAdmin){
        return Promise.reject('Not an Admin')
    }

    let values = pick(body,['title','type'])
    values = {...values,'createdBy':user._id}

    const category = new Category(values)

    return category.save()
            .then(function(category){
                return Promise.resolve(category)
            })
            .catch(function(err){
                return Promise.reject(err)
            })
}

/* Function to edit category */

categorySchema.statics.editCat = function(id,body,user){
    const Category = this

    return Category.findByIdAndUpdate(id,{$set:{title:body.title},$addToSet:{modified:{modifiedBy:user}}},{new:true, runValidators:true})
                .then(function(category){
                    return Promise.resolve(category)
                })
                .catch(function(err){
                    return Promise.reject(err)
                })
}

const Category = mongoose.model('Category',categorySchema)

module.exports = Category
