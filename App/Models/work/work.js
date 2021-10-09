const mongoose = require('mongoose')
const Option = require('./optionSubdoc')
const Result = require('./resultSubdoc')
const pick = require('lodash/pick')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const { v4: uuidv4 } = require('uuid')
const keys = require('../../Config/keys')

const Schema = mongoose.Schema

const workSchema = new Schema({
    title:{
        type:String,
        maxlength:40,
        minlength:2,
        required:true
    },
    status:{
        type:String,
        validator: function (value){
            switch(value){
                case 'Unlisted':
                    return true
                case 'Available':
                    return true
                case 'Unavailable':
                    return true
                default:
                    return false
            }
        },
        default:'Unlisted'
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
    imagePath:{
        type:String
    },
    options:{
        _id:{
            type:Schema.Types.ObjectId,
            ref:'Option',
            required:true
        },
        params:[{
            optionType:{
                type:String
            },
            tierType:{
                type:Boolean,
                default:false
            },
            unit:{
                type:String
            },
            values:[{
                min:{
                    type:Number
                },
                max:{
                    type:Number
                },
                value:{
                    type:Number
                },
                label:{
                    type:String
                },
                desc:{
                    type:String
                },
                time:{
                    type:Number
                },
                initial:{
                    type:Boolean
                },
                amount:{
                    type:Boolean
                }
            }],
            title:{
                type:String
            },
            desc:{
                type:String
            },
            checkbox:{
                value:{
                    type:Boolean
                },
                trueValue:{
                    value:{
                        type:Number
                    }
                },
                title:{
                    type:String
                },
                desc:{
                    type:String
                }
            }
        }]
    },
    result:{
        _id:{
            type:Schema.Types.ObjectId,
            ref:'Result',
            required:true
        },
        values:[{
            type:Number
        }],
        time:{
            values:[{
                type:Number
            }],
            calc:[{
                method:{
                    type:String
                },
                keys:[{type:Number}],
                calcValues:[{type:Number}]  
            }]
        },
        calc:[
            {
                method:{
                    type:String
                },
                keys:[{type:Number}],
                calcValues:[{type:Number}]
            }
        ],
        sampleAvailable:{
            type:Boolean,
            default:true
        }
    }
})

/* Function to create new work */  // Pending work //use pick on options and result

workSchema.statics.createNew = async function(req,Type,Category){
    const Work = this
    
    try{
        const body = req.body

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
        const savedOption = await Option.findOneAndUpdate({_id:options._id},{$set:{...options}},{runValidators:true,new:true})
        const savedResult = await Result.findOneAndUpdate({_id:results._id},{$set:{...results}},{new:true,runValidators:true})

        if(!savedOption||!savedResult){
            return Promise.reject({status:false,message:'Category not found',statusCode:403})
        }
        
        const work = await Work.findById(workBody._id)
        work.title = workBody.title
        work.option = savedOption
        work.result = savedResult

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
            const works = await Work.find({$or:[{status:'Unavailable'},{status:'Available'}]}) //remove once client frontend is updated
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

workSchema.statics.changeStatus = async function (workId,body){
    const Work = this

    try{
        const status = body.status

        if(status!='Unavailable'&&status!='Available'&&status!='Unlisted'){
            return Promise.reject({status:false,message:'Invalid Input',statusCode:403})
        }

        const res = await Work.updateOne({_id:workId,imagePath:{$exists:true,$ne:null}},{$set:{status:status}},{runValidators:true})

        if(!res.nModified){
            return Promise.reject({status:false,message:'Image not added / Server Error',statusCode:500})
        }

        return Promise.resolve({status:true,message:'Status changed successfully'})
    }
    catch(e){
        return Promise.reject(e)
    }
}

workSchema.statics.changeImage = async function (workId,req) {
    const Work = this

    try{

        const work = await Work.findById(workId)

        const client = new S3Client({
            'region':keys.awsRegion
        });

        const command = new PutObjectCommand({
            Bucket:'exvate-images',
            Body:req.file.buffer,
            Key:`works/${work._id}`,
            contentType:'images/png',
            contentDisposition:'inline',
        });

        const response = await client.send(command);

        if(response.$metadata.httpStatusCode!=200){
            return Promise.reject({status:false,message:'Error changing image',statusCode:500})
        }

        work.imagePath = `https://exvate-images.s3.amazonaws.com/works/${work._id}`

        await work.save()

        return Promise.resolve({status:true,message:'Successfully changed/added image'})
    }
    catch(e){
        return Promise.reject(e)
    }
}

const Work = mongoose.model('Work', workSchema)

module.exports = Work