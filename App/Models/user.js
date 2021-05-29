const mongoose = require('mongoose')
const Validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pick = require('lodash/pick')
const sendMail = require('../Resolvers/sendMail')
const generator = require('generate-password')
const Order = require('./order') // find another way
const Option = require('./work/optionSubdoc')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name:{
        type:String,
        required:true,
        maxlength:30,
        minlength:3
    },
    email:{
        email:{
            type:String,
            unique:true,
            required:true,
            validate:{
                validator:function(value){
                    return Validator.isEmail(value)
                },
                message:function(){
                    return 'Invalid Email'
                }
            }
        },
        confirmed:{
            token:{             //Token for email confirmation
                type:String
            },
            value:{             //The value to verify that the email has been confimed
                type:Boolean
            }
        }
    },
    mobile:{
        type:String
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    tokens:[{
        token:{
            type:String
        },
        createdAt:{
            type:Date,
            default:Date.now
        }
    }],
    forgotToken:{
        token:{                 //Token to change the password //PENDING forgot password expiration
            type:String
        }
    },
    address:[{
        building:{
            type:String,
            maxlength:32,
            minlength:2
        },
        street:{
            type:String,
            maxlength:32,
            minlength:2
        },
        city:{
            type:String,
            maxlength:30,
            minlength:2
        },
        state:{
            type:String,
            maxlength:30,
            minlength:2
        },
        country:{
            type:String,
            maxlength:30,
            minlength:2
        },
        pin:{
            type:String,
            maxlength:30,
            minlength:2
        }
    }],
    isAdmin:{
        value:{
            type:Schema.Types.ObjectId
        },
        token:{
            type:String
        },
        auth:{
            type:Number,
            default:1
        }
    },
    userType:{                              // To assign the user type
        type:String,
        required:true,
        validate:{
            validator:function(value){
                switch(value){
                    case 'User':
                        return true
                    case 'Admin':
                        return true
                    case 'Supplier':
                        return true
                    default:
                        return false
                }
            },
            message:function(){
                return 'Invalid User type'
            }
        },
        default:'User'
    },
    supplier:{
        type:Boolean,
        default:false
    },
    work:{
        workDetails:[{
            workId:{
                type:Schema.Types.ObjectId,
                ref:'Work'
            },
            options:{
                type:Schema.Types.ObjectId,
                ref:'Option'
            },
            verified:[{
                verifiedBy:{
                    type:Schema.Types.ObjectId,
                    ref:'User'
                },
                verifiedAt:{
                    type:Date,
                    default:Date.now
                }
            }]
        }],
        workOrder:[{
            type:Schema.Types.ObjectId,
            ref:'Order'
        }]
    },
    orders:[{
        type:Schema.Types.ObjectId,
        ref:'Order'
    }],
    notifications:[{
        type:Schema.Types.ObjectId,
        ref:'Notification'
    }],
    perms:{                                  //To check if the user is verified by the verification team
        user:{
            verified:{
                type:Schema.Types.ObjectId,
                ref:'User'
            },
            suspended:{
                value:{
                    type:Boolean,
                    default:false
                },
                doneBy:{
                    type:Schema.Types.ObjectId,
                    ref:'User'
                }
            },
            banned:{
                value:{
                    type:Boolean,
                    default:false
                },
                doneBy:{
                    type:Schema.Types.ObjectId,
                    ref:'User'
                }
            }
        },
        supplier:{
            verified:{
                type:Schema.Types.ObjectId,
                ref:'User'
            },
            multipleWorks:{
                value:{
                    type:Boolean,
                    default:false
                },
                doneBy:{
                    type:Schema.Types.ObjectId,
                    ref:'User'
                }
            },
            suspended:{
                value:{
                    type:Boolean,
                    default:false
                },
                doneBy:{
                    type:Schema.Types.ObjectId,
                    ref:'User'
                },
                createdAt:{
                    type:Date
                },
                duration:{
                    type:Date
                }
            },
            banned:{
                value:{
                    type:Boolean,
                    default:false
                },
                doneBy:{
                    type:Schema.Types.ObjectId,
                    ref:'User'
                }
            }
        }
    },
    adminCreated:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

userSchema.pre('save',function(next){
    const user = this

    /* Used to hash the password of the user */

    if(user.isNew){                                         // checks if the document is new
        bcryptjs.genSalt(14)
            .then(function(salt){
                bcryptjs.hash(user.password,salt)
                    .then(function(encryptedPassword){
                        user.password = encryptedPassword
                        next()
                    })
            })
    }

    /* To check for the forgot Token and to hash the password when the user updates password */

    else if(user.forgotToken.token&&user.isDirectModified('password')){ // checks if the password has been modified and if password reset token exists
        bcryptjs.genSalt(14)
            .then(function(salt){
                bcryptjs.hash(user.password,salt)
                    .then(function(encryptedPassword){
                        user.password = encryptedPassword
                        user.tokens = undefined
                        user.forgotToken = undefined                //Token removed when password is changed
                        next()
                    })
            })
    }
    else{
        next()
    }
})


/* Assigns a token for email confirmation and sends an email with the link */

userSchema.methods.registerMail = async function(){
    const user = this

    try{
        const createdAt = new Date()
        let tokenData = {
            createdAt:createdAt
        }
    
        const token = jwt.sign(tokenData,'Secret123&') //PENDING - VULNERABILITY - use randombytes
    
        let mailData = {
            from: '"Sourceo" <ajaydragonballz@gmail.com>',
            to: user.email.email, // list of receivers
            subject: "Signup email confirmation",
            text: `Test - http://localhost:3000/user/confirmSign/${token}`, // Email confirmation link
            /*html: "<b>Hello world?</b>"*/ // html body
        }
    
        /* checks if the email token is empty (first time) */
        if(!user.email.confirmed.token){
            user.set('email.confirmed.token', token)
            await user.save()
            const info = await sendMail(mailData)
            return Promise.resolve(info)
        }
    
        /* uses existing token for the link (email resend) */
        mailData.text = `Click the following link to verify \n\nhttp://localhost:3000/user/confirmSign/${user.email.confirmed.token}`
    
        const info = await sendMail(mailData)
        return Promise.resolve(info)
    }
    catch(e){
        console.log(e)
        return Promise.reject('Error sending message')
    }
}

/* PENDING - Lazy - Login function. Also checks if the email has been confirmed */

userSchema.statics.findByCredentials = function(email,password){
    const User = this

    return User.findOne({'email.email':email})
        .then(function(user){

            /* checks if user is present and if email is confirmed */
            if(!user){
                return Promise.reject('Invalid email or password')
            }else if(!user.email.confirmed.value){
                if(user.adminCreated){
                    user.email.confirmed.value = true
                }else{
                    return Promise.reject('Please confirm email')
                }
            }

            return bcryptjs.compare(password,user.password)
                .then(function(result){
                    if(result){
                        return Promise.resolve(user)
                    }
                    else{
                        return Promise.reject('Invalid email or password')
                    }
                })
                .catch(function(err){
                    return Promise.reject(err)
                })
        })
}

/* Finds user by the given email */

userSchema.statics.findByEmail = function(email){
    const User = this

    return User.findOne({'email.email':email})
                .then(function(user){
                    if(!user){
                        return Promise.reject('Email does not exist')
                    }
                    return Promise.resolve(user)
                })
                .catch(function(err){
                    return Promise.reject(err)
                })
}

/* Finds the user for whom the login token belongs to */

userSchema.statics.findByToken = function(token){
    const User = this

    return User.findOne({'tokens.token':token})
            .then(function(user){
                return Promise.resolve(user)
            })
            .catch(function(err){
                return Promise.reject(err)
            })
}

/* Creates token to change the Password and sends the email with link */

userSchema.methods.generateForgotToken = function(){
    const user = this
    
    const tokenData = {
        createdAt:new Date()
    }

    const token = jwt.sign(tokenData, "Secret123&",{expiresIn:'3m'}) //PENDING- VULNERABILITY

    let mailData = {
        from: '"Sourceo" <ajaydragonballz@gmail.com>',
        to: user.email.email, // list of receivers
        subject: "Change Password",
        text: `Test - http://localhost:3000/user/confirmForgot/${token}`, // Email confirmation link
        /*html: "<b>Hello world?</b>"*/ // html body
    }

    /* forgot token saved to user */
    user.forgotToken.token = token

    return user.save()
                .then(function(){
                    /* send mail with confirmation link */
                    return sendMail(mailData)
                })
                .then(function(info){
                    return Promise.resolve('Mail sent')
                })
                .catch(function(err){
                    return Promise.reject(err)
                })
}

/* Creates a login token for the User */

userSchema.methods.generateToken = function(){
    const user = this
    const tokenData = {
        createdAt:new Date()
    }

    const token = jwt.sign(tokenData,'Secret@123&') //PENDING - VULNERABILITY - use CSRPG
    user.tokens.push({token})
    return user.save()
            .then(function(){
                return Promise.resolve(token)
            })
            .catch(function(err){
                return Promise.reject(err)
            })
}

/* confirms the email when the link from the verification email is followed */

userSchema.statics.confirmEmail = function(token){
    const User = this

    return User.findOne({'email.confirmed.token':token})
                .then(function(user){
                    if(!user){
                        return Promise.reject('user not found')
                    }
                    user.email.confirmed.value = true
                    return user.save()
                })
                .then(function(user){
                    return Promise.resolve(user)
                })
                .catch(function(err){
                    return Promise.reject(err)
                })
}

/* To confirm the change in password from the email and also update the new password */

userSchema.statics.confirmPassword = async function(token,password){
    const User = this

    try{
        const user = User.findOne({'forgotToken.token':token})
        if(!user){
            return Promise.reject('Invalid password change attempt')
        }
        jwt.verify(token,"Secret123&")
        user.set('password',password)
        user.save()
        return Promise.resolve(user)
    }
    catch(e){
        console.log(err)
        return Promise.reject(err)
    }
}

/* Admin credential middleware check */

userSchema.statics.adminSignAction = function(email,password){
    const User = this

    return User.findOne({'email.email':email})
        .then(function(user){
            if(!user){
                return Promise.reject('Invalid email or password')
            }

            return bcryptjs.compare(password,user.password)
                .then(function(result){
                    if(result){
                        return Promise.resolve(user)
                    }
                    else{
                        return Promise.reject('Invalid email or password')
                    }
                })
                .catch(function(err){
                    return Promise.reject(err)
                })
        })
}

/* Admin login function */

userSchema.statics.adminLogin = function(email,password){
    const User = this

    return User.findOne({'email.email':email})
            .then(function(user){
                /* checks if the user is an admin */
                if(!user||!user.isAdmin.value){
                    return Promise.reject('Invalid login attempt')
                }

                return bcryptjs.compare(password,user.password)
                    .then(function(result){
                        if(result){
                            return Promise.resolve(user)
                        }
                        else{
                            return Promise.reject('Invalid login attempt')
                        }
                    })
                    .catch(function(err){
                        return Promise.reject(err)
                    })
            })
            .catch(function(err){
                return Promise.reject(err)
            })
}

/* Admin login token generation */

userSchema.methods.generateAdminToken = function(){
    const user = this

    let tokenData = {
        createdAt:new Date()
    }

    const token = jwt.sign(tokenData,'Secret@123&') //PENDING - VULNERABILITY - use CSRPG - Expiration
    user.set('isAdmin.token',token)

    /* admin token is saved to isAdmin.token not tokens array */
    return user.save()
            .then(function(user){
                return Promise.resolve(user.isAdmin.token)
            })
            .catch(function(err){
                return Promise.reject(err)
            })
}

/* Admin token middleware check */

userSchema.statics.findByAdminToken = function(token){
    const User = this

    return User.findOne({'isAdmin.token':token}).lean()
                .then(function(user){
                    if(!user){
                        return Promise.reject('Invalid request')
                    }
                    return Promise.resolve(user)
                })
                .catch(function(err){
                    return Promise.reject(err)
                })
}

/* Helps change the order status and move it to respt. arrays in user */
userSchema.statics.saveOrder = async function(order,id){
    const User = this

    try{
        let user = await User.findById(id)
        user.orders = user.orders.concat(order)
        user = await user.save()
        return Promise.resolve(user)
    }
    catch(e){
        console.log(e)
        return Promise.reject('Error saving order to user')
    }
}

/* Adds,deletes or updates work for the host*/
userSchema.statics.updateWork = async function(id,body){
    const User = this

    const params = pick(body,['workId','options'])
    console.log(params)
    
    try{
        const user = await User.findById(id)
        const option = new Option(params.options)
        params.options = option

        /* deletes the work */
        if(body.select == 'delete'){
            const workIndex = user.work.workDetails.findIndex((element)=>{
                return element.workId == params.workId
            })
            user.work.workDetails.splice(workIndex,1)
            await user.save()
            return Promise.resolve('Work deleted')
        }

        /* updates the work */
        if(body.select == 'update'){
            const workIndex = user.work.workDetails.findIndex((element)=>{
                return element.workId == params.workId
            })

            user.work.workDetails[workIndex] = params
            await params.options.save()
            await user.save()
            return Promise.resolve('Work updated')
        }

        /* checks permission to add multiwork */
        if(params.options.options.length>1){
            return Promise.reject('User is not verified for a multiwork')
        }

        /* could be wrong,check */
        let workIndex = user.work.workDetails.findIndex((element)=>{
            return element.workId == params.workId
        })

        /* if added, checks if work already exists */
        if(workIndex!=-1){
            return Promise.reject('Work already exists')
        }
        else{
            /* checks permission if user can add multiple works */
            if(user.work.workDetails.length>=1){
                if(!user.perms.supplier.multipleWorks.value){
                    return Promise.reject('Contact support to add multiple inventories')
                }

                await params.options.save()
                user.work.workDetails.push(params)
                await user.save()
                return Promise.resolve('Work added')
            }
            else{
                await params.options.save()
                user.work.workDetails.push(params)
                await user.save()
                return Promise.resolve('Work added')
            }
        }
    }
    catch(err){
        console.log(err)
        Promise.reject('Error in updating work')
    }
}

/* Finds all the work according to the required filter */
userSchema.statics.workAll = async function (id,body){
    const User = this

    try{
        const user = await User.findById(id).lean()
        switch(body.select){
            case 'WorkDetails':
                return Promise.resolve(user.work.workDetails)
            case 'orders':
                return Promise.resolve({order:user.work.workOrder})
            default:
                return Promise.reject(`Option doesn't exist`)
        }
    }
    catch(err){
        console.log(err)
        return Promise.reject('error finding work details')
    }
}

/* Finds all the orders of a user */
userSchema.statics.orders = async function(id){
    const User = this

    try{
        const user = await User.findById(id).populate('orders').lean()
        return Promise.resolve(user.orders)
    }
    catch(err){
        console.log(err)
        return Promise.reject('error finding work details')
    }
}

/* checks that a user with forgotToken is present */
userSchema.statics.forgotCheck = function(token){
    const User = this

    return User.findOne({'forgotToken.token':token})
        .then((user)=>{
            return Promise.resolve(user)
        })
        .catch((err)=>{
            return Promise.reject(err)
        })
}

/* Find suppliers based on the order inventory requirement */
userSchema.statics.orderSuppliers = async function(orderId){
    const User = this

    try{
        let order = await Order.findById(orderId)
        let suppliers = await User.find({'work.workDetails.workId':order.workId,supplier:true})
        let response = {order,suppliers}
        return Promise.resolve(response)
    }
    catch(e){
        return Promise.reject('Error fetching suppliers')
    }
}

/* Add email notification and provide password on creation -- CHECK USAGE*/
/* userSchema.statics.adminCreate = async function(body){
    const User = this

    try{
        console.log(body)
        const creds = pick(body,['name','email','mobile','address','userType','host','perms'])

        const password = generator.generate({
            symbols:true,
            strict:true
        })

        creds.password = password
        creds.adminCreated = true
        console.log(creds)

        if(!creds.host){
            delete creds.host
            delete creds.perms
        }

        const mailData = {
            from: '"Sourceo" <kajaymenon@hotmail.com>',
            to: user.email.email, // list of receivers
            subject: "Account Created",
            text: `An account has been created for you by our team. Please use the credentials below to sign in.\n\n email:${email} \n password:${password}`
        }

        const user = new User(creds)
        
        const mailInfo = await sendMail(mailData)
        console.log(mailInfo)

        const savedUser = await user.save()

        return Promise.resolve(savedUser)
    }
    catch(e){
        console.log(e)
    }
} */

userSchema.statics.assignWork = async function(orderId,hostId,type){
    const User = this

    try{
        const supplier = await User.findById(hostId)
        if(type=='assign'){
            if(!supplier.work.workOrder.includes(orderId)){
                supplier.work.workOrder.push(orderId)
                await supplier.save()
            }
            return Promise.resolve(supplier)
        }
        else if(type=='remove'){
            if(supplier.work.workOrder.includes(orderId)){
                supplier.work.workOrder = supplier.work.workOrder.filter(ele=>String(ele)!=orderId)
                await supplier.save()
                return Promise.resolve('work removed')
            }
            return Promise.reject('User is not assigned the order')
        }
        else{
            return Promise.reject('Type not provided')
        }
    }
    catch(e){
        console.log(e)
        return Promise.reject(e)
    }
}

/* userSchema.statics.notify = async function(type,id,message,userId){
    const User = this

    try{
        let user = await User.findById(userId)
        const notification = {
            notificationType:type,
            id,
            message
        }
        user.notifications.push(notification)
        console.log(notification)
        user = await user.save()
        return Promise.resolve(user)
    }
    catch(e){
        console.log(e)
        return Promise.reject('Error creating notification')
    }
} */

userSchema.statics.hostCancel = async function(orderId,reqUser){
    const User = this

    try{
        const order = reqUser.work.workOrder.find(ele=>ele==orderId)
        if(!order&&!reqUser.isAdmin.value){
            return Promise.reject('Unauthorised')
        }
        reqUser.work.workOrder = reqUser.work.workOrder.filter(ele=>ele!=orderId)
        await Order.updateOne({_id:order},{'verified.value':false,'host.assigned':[],$addToSet:{'host.removed':reqUser._id}})
        await reqUser.save()
        Promise.resolve(reqUser)
    }
    catch(e){
        console.log(e)
        return Promise.reject('Error cancelling order')
    }
}

userSchema.statics.userEdit = async function(user,body,id){
    const User = this

    const userBody = pick(body,['name','email.email','mobile','address','userType','supplier'])

    try{
        if(user.isAdmin.value||user._id==id){
            const user = await User.findByIdAndUpdate(id,{...userBody})
            console.log(user)
            return Promise.reject('Successfully updated')
        }
        else{
            return Promise.reject('Unauthorised')
        }
    }
    catch(e){
        console.log(e)
        Promise.reject('Error updating user')
    }
}

const User = mongoose.model('User',userSchema)

module.exports = User