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
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Type'
    },
    category:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Category'
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

workSchema.statics.createNew = async (body) =>{
    
    try{
        const options = body.options
        const results = body.result
        const workBody = pick(body,['title','type','category'])

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
        return Promise.resolve({status:true,message:'Work Created Successfully'})
    }
    catch(e){
        return Promise.reject(e)
    }
}

workSchema.statics.workEdit = async (body) =>{
    const options = body.options    //pick
    const results = body.result     //pick
    const workBody = pick(body,['title','type','category','_id'])

    try{
        await Option.updateOne({_id:options._id},{...options})
        await Result.updateOne({_id:results._id},{$set:{...results}})
        const work = await Work.findOneAndUpdate({_id:workBody._id},{$set:{...workBody}},{new:true}).populate('type','title').populate('category','title')

        return Promise.resolve(work)
    }
    catch(e){
        return Promise.reject(e)
    }
}

workSchema.statics.all = async (query,user) =>{
    try{
        if(!user){
            const works = await Work.find({}).limit(10) //remove once client frontend is updated
            return Promise.resolve({works})
        }
        else if(query.filter.q!=undefined){
            query.filter = JSON.parse(query.filter)
            query.sort = JSON.parse(query.sort)
            query.range = JSON.parse(query.range)
            
            const works = await Work.find({title:{$regex:query.filter.q}}).populate('type','title').populate('category','title').skip(query.range[0]).limit(query.range[1]+1-query.range[0])
            const count = await Work.countDocuments({title:{$regex:query.filter.q}})
            return Promise.resolve({works,count:`orders ${query.range[0]}-${query.range[1]}/${count}`})
        }
        else{
            query.filter = JSON.parse(query.filter)
            query.sort = JSON.parse(query.sort)
            query.range = JSON.parse(query.range)

            const works = await Work.find().populate('type','title').populate('category','title').skip(query.range[0]).limit(query.range[1]+1-query.range[0])
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