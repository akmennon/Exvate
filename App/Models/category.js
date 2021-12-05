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

categorySchema.statics.findAll = async function(){
    const Category = this

    try{
        const categories = await Category.aggregate([
            {
                $facet:{
                    categories:[
                        {
                            $limit:10
                        }
                    ],
                    count:[
                        {
                            $count:'count'
                        }
                    ]
                }
            }
        ])

        return Promise.resolve({categories:categories[0].categories,count:categories[0].count[0]?categories[0].count[0].count:0})
    }
    catch(e){
        return Promise.reject(e)
    }
}

const Category = mongoose.model('Category',categorySchema)

module.exports = Category
