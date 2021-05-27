const mongoose = require('mongoose')

const Schema = mongoose.Schema

const notificationSchema = new Schema({
    notificationType:{
        type:String,
        validate:{
            validator:function(value){
                switch(value){
                    case 'Order':
                        return true
                    default:
                        return false
                }
            },
            message:function(){
                return 'Notification type not provided'
            }
        }
    },
    id:{
        type:String
    },
    message:{
        type:String
    },
    viewed:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Notification = mongoose.model('Notification',notificationSchema)

module.exports = Notification