const mongoose = require('mongoose')

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

workSchema.statics.searchAll = async function (query,autoSearch,pageCount){
    const Work = this

    try{
        let works
        if(autoSearch){
            works = await Work.aggregate([
                {
                   $search:{
                       index:"WorkSearch",
                       autocomplete:{
                            query:query,
                            path:"title"
                        }
                   }
                },
                {
                    $project:{
                        title:1,
                        _id:1,
                        imagePath:1
                    }
                },
                {
                    $facet:{
                        works:[
                            {
                                $limit:15
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
        }
        else{
            works = await Work.aggregate([
                {
                   $search:{
                       index:"WorkSearch",
                       autocomplete:{
                            query:query,
                            path:"title"
                        }
                   }
                },
                {
                    $project:{
                        title:1,
                        _id:1,
                        status:1,
                        type:{title:1},
                        category:{title:1},
                        imagePath:1
                    }
                },
                {
                    $facet:{
                        works:[
                            {
                                $skip:(pageCount-1)*15
                            },
                            {
                                $limit:15
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
        }

        return Promise.resolve({works:works[0].works,count:works[0].count[0]?works[0].count[0].count:0})
    }
    catch(e){
        return Promise.reject(e)
    }
}

const Work = mongoose.model('Work', workSchema)

module.exports = Work