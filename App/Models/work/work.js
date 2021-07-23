const mongoose = require('mongoose')
const Option = require('./optionSubdoc')
const Result = require('./resultSubdoc')
const pick = require('lodash/pick')

const Schema = mongoose.Schema

const workSchema = new Schema({
    title:{
        type:String,
        maxlength:40,
        minlength:2,
        required:true
    },
    type:{
        _id:{
            type:Schema.Types.ObjectId,
            ref:'Type',
            required:true
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
    category:{
        _id:{
            type:Schema.Types.ObjectId,
            ref:'Category',
            required:true
        },
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
        hscode:{
            type:String,
            minlength:4,
            maxlength:4
        }
    },
    options:{
        type:Schema.Types.ObjectId,
        ref:'Option'
    },
    result:{
        type:Schema.Types.ObjectId,
        ref:'Result'
    }
})

/* Function to create new work */  // Pending work //use pick on options and result

workSchema.statics.createNew = async function(body,Type,Category){
    const Work = this
    
    try{
        const options = body.options
        const results = body.result
        const workBody = pick(body,['title','type','category'])
        workBody.type = await Type.findById(workBody.type)
        workBody.category = await Category.findById(workBody.category)

        const work = new Work(workBody)

        options.workId=work._id
        options.workTitle=work.title
        results.workId=work._id

        const option = new Option(options)
        const result = new Result(results)

        /* result and option are saved first and added to the work to be saved */
        await option.save()
        work.options = option

        await result.save()
        work.result = result

        await work.save()
        return Promise.resolve(work)
    }
    catch(e){
        return Promise.reject(e)
    }
}

workSchema.statics.workEdit = async function(body,Type,Category){
    const options = body.options    //pick
    const results = body.result     //pick
    const workBody = pick(body,['title','type','category','_id'])

    try{
        await Option.updateOne({_id:options._id},{...options})
        await Result.updateOne({_id:results._id},{$set:{...results}})
        const work = await Work.findById(workBody._id)
        work.title = workBody.title

        if(work.type._id.toString() !== workBody.type){
            const type = await Type.findById(workBody.type)
            if(type){
                work.type = type
            }
            else{
                return Promise.reject({status:false,message:'Type not found',statusCode:403})
            }
        }

        if(work.category._id.toString() !== workBody.category){
            const category = await Category.findById(workBody.category)
            if(category){
                work.category = category
            }
            else{
                return Promise.reject({status:false,message:'Category not found',statusCode:403})
            }
        }

        await work.save()
        return Promise.resolve(work)
    }
    catch(e){
        return Promise.reject(e)
    }
}

workSchema.statics.all = async (query,user) =>{
    try{
        if(!user){
            const works = await Work.find({}) //remove once client frontend is updated
            return Promise.resolve({works})
        }
        else if(query.filter.q!=undefined){
            query.filter = JSON.parse(query.filter)
            query.sort = JSON.parse(query.sort)
            query.range = JSON.parse(query.range)
            
            const works = await Work.find({title:{$regex:query.filter.q}}).skip(query.range[0]).limit(query.range[1]+1-query.range[0])
            const count = await Work.countDocuments({title:{$regex:query.filter.q}})
            return Promise.resolve({works,count:`orders ${query.range[0]}-${query.range[1]}/${count}`})
        }
        else{
            query.filter = JSON.parse(query.filter)
            query.sort = JSON.parse(query.sort)
            query.range = JSON.parse(query.range)

            const works = await Work.find().skip(query.range[0]).limit(query.range[1]+1-query.range[0])
            const count = await Work.countDocuments()
            return Promise.resolve({works,count:`orders ${query.range[0]}-${query.range[1]}/${count}`})
        }
    }
    catch(e){
        return Promise.reject(e)
    }
}

const Work = mongoose.model('Work', workSchema)

module.exports = Work