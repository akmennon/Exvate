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

workSchema.statics.createNew = (body) =>{
    const options = body.options
    const results = body.result
    const workBody = pick(body,['title','type','category'])

    const work = new Work(workBody)

    /* checks if it is a single work */
    if(options.options.length===1){

        /* workId is saved to the first element, since its single work */
        options.options[0].workId=work._id
        results.result[0].workId=work._id
    }

    const option = new Option(options)
    const result = new Result(results)

    /* result and option are saved first and added to the work to be saved */
    return option.save()
        .then(function(option){
            work.options = option
            return result.save()
        })
        .then(function(result){
            work.result = result
            return work.save()
        })
        .then(function(work){
            return Promise.resolve(work)
        })
        .catch(function(err){
            return Promise.reject(err)
        })
}

workSchema.statics.workEdit = async (body) =>{
    const options = body.options
    const results = body.result
    const workBody = pick(body,['title','type','category','_id'])

    try{
        await Option.updateOne({_id:options._id},{...options})
        await Result.updateOne({_id:results._id},{...results})
        await Work.updateOne({_id:workBody._id},{...workBody,$set:{options:options._id,result:results._id}})

        return Promise.resolve('Work updated')
    }
    catch(e){
        console.log(e)
        return Promise.reject('Error updating work')
    }
}

workSchema.statics.all = async (query,res,user) =>{
    try{
        if(!user){
            const works = await Work.find({}).limit(10)
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
        console.log(e)
        return Promise.reject('Error fetching works')
    }
}

const Work = mongoose.model('Work', workSchema)

module.exports = Work