const mongoose = require('mongoose')
const Validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pick = require('lodash/pick')
const sendMail = require('../Resolvers/sendMail')
const generator = require('generate-password')
const Order = require('./order') // find another way
const Option = require('./work/optionSubdoc')
const keys = require('../Config/keys')

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
        token:{                 //Token to change the password
            type:String
        },
        expiresAt:{
            type:Date,
            default:Date.now
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
            type:Number, //Highest level = 0
            min:0,
            max:3
        },
        banned:{
            value:{
                type:Boolean
            },
            doneBy:{
                type:Schema.Types.ObjectId,
                ref:'User'
            },
            createdAt:{
                type:Date
            },
            reason:{
                type:String,
                maxlength:120,
                minlength:5
            }
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
                    case 'Supplier':
                        return true
                    case 'Affiliate':
                        return true
                    case 'CHA':
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
            verified:{
                verifiedBy:{
                    type:Schema.Types.ObjectId,
                    ref:'User'
                },
                verifiedAt:{
                    type:Date
                }
            }
        }],
        workOrder:[{
            type:Schema.Types.ObjectId,
            ref:'Order'
        }],
        workHistory:[{
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
                duration:{
                    type:Date
                },
                details:[{
                    reason:{
                        type:String,
                        maxlength:120,
                        minlength:5
                    },
                    doneBy:{
                        type:Schema.Types.ObjectId,
                        ref:'User'
                    },
                    createdAt:{
                        type:Date,
                        default:Date.now
                    }
                }]
            },
            banned:{
                value:{
                    type:Boolean,
                    default:false
                },
                doneBy:{
                    type:Schema.Types.ObjectId,
                    ref:'User'
                },
                reason:{
                    type:String,
                    maxlength:120,
                    minlength:5
                },
                createdAt:{
                    type:Date
                }
            }
        },
        supplier:{
            verified:{
                type:Boolean,
                default:false
            },
            multipleWorks:{
                workCount:{
                    type:Number,
                    min:1,
                    max:10
                },
                doneBy:[{
                    type:Schema.Types.ObjectId,
                    ref:'User'
                }]
            },
            suspended:{
                value:{
                    type:Boolean,
                    default:false
                },
                duration:{
                    type:Date
                },
                details:[{
                    reason:{
                        type:String,
                        maxlength:120,
                        minlength:5
                    },
                    doneBy:{
                        type:Schema.Types.ObjectId,
                        ref:'User'
                    },
                    createdAt:{
                        type:Date
                    }
                }]
            },
            banned:{
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
                reason:{
                    type:String,
                    maxlength:120,
                    minlength:5
                }
            }
        }
    }/*,                                //For admin created user
    adminCreated:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }*/
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
    
        const token = jwt.sign(tokenData,keys.jwtSecret) //PENDING - VULNERABILITY - use randombytes
    
        let mailData = {
            from: '"Exvate" <ajaydragonballz@gmail.com>',
            to: user.email.email, // list of receivers
            subject: "Signup email confirmation",
            text: `Test - http://localhost:3000/user/confirmSign/${token}`, // Email confirmation link
            /*html: "<b>Hello world?</b>"*/ // html body
        }
    
        /* checks if the email token is empty (first time) */
        if(!user.email.confirmed.token){
            user.set('email.confirmed.token', token)
            await user.save()
            await sendMail(mailData)
            return Promise.resolve({status:true,message:'Successfully sent mail'})
        }
    
        /* uses existing token for the link (email resend) */
        mailData.text = `Click the following link to verify \n\nhttp://localhost:3000/user/confirmSign/${user.email.confirmed.token}`
    
        await sendMail(mailData)
        return Promise.resolve({status:true,message:'Successfully sent mail'})
    }
    catch(err){
        return Promise.reject(err)
    }
}

/* PENDING - Lazy - Login function. Also checks if the email has been confirmed */

userSchema.statics.findByCredentials = async function(email,password){
    const User = this

    try{
        const user = await User.findOne({'email.email':email})

        if(!user){
            return Promise.reject({message:'Invalid email or password',statusCode:401})
        }
        else if(!user.email.confirmed.value){
            //Admin created user work
            /*if(user.adminCreated){
                user.email.confirmed.value = true
            }else{
                return Promise.reject({message:'Please confirm email',statusCode:401,payload:{email:false}})
            }*/

            return Promise.reject({status:false,message:'Please confirm email',statusCode:401,payload:{email:true}})
        }
        
        if(user.perms.user.suspended&&user.perms.user.suspended.value){
            return Promise.reject({status:false,message:'User suspended',statusCode:401,payload:{duration:new Date(user.perms.user.suspended.duration)}})     
        }

        if(user.perms.user.banned&&user.perms.user.banned.value){
            return Promise.reject({status:false,message:'User Banned',statusCode:401})
        }
        
        const result = bcryptjs.compare(password,user.password)

        if(result){
            return Promise.resolve(user)
        }
        else{
            return Promise.reject({message:'Invalid email or password',statusCode:401})
        }
    }
    catch(e){
        return Promise.reject(e)
    }
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
                if(user){
                    if(user.isAdmin.value){
                        return Promise.reject({status:false,message:'Invalid Usertype',statusCode:403})
                    }
                    else if(user.perms.user.suspended&&user.perms.user.suspended.value){
                        console.log(new Date(user.perms.user.suspended.duration))
                        return Promise.reject({status:false,message:`Under suspension`,statusCode:401})
                    }
                    else if(user.perms.user.banned&&user.perms.user.banned.value){
                        return Promise.reject({status:false,message:`Banned`,statusCode:401})
                    }
                    else{
                        return Promise.resolve(user)
                    }
                }
                else{
                    return Promise.reject({status:false,message:`Unauthorized`,statusCode:401})
                }
            })
            .catch(function(err){
                return Promise.reject(err)
            })
}

/* Creates token to change the Password and sends the email with link */

userSchema.methods.generateForgotToken = async function(){
    const user = this
    
    try{
        const createdAt = new Date()

        const tokenData = {createdAt}

        if(user.forgotToken.token&&new Date(user.forgotToken.expiresAt).getTime()>Date.now()){
            let mailData = {
                from: '"Exvate" <ajaydragonballz@gmail.com>',
                to: user.email.email, // list of receivers
                subject: "Change Password",
                text: `Test - http://localhost:3000/user/confirmForgot/${user.forgotToken.token}`, // Email confirmation link
                /*html: "<b>Hello world?</b>"*/ // html body
            }

            await sendMail(mailData)
            return Promise.resolve({status:true,message:'Link to change password has been resent to your email address'})
        }

        const token = jwt.sign(tokenData, keys.jwtSecret,{expiresIn:'1h'})

        let mailData = {
            from: '"Exvate" <ajaydragonballz@gmail.com>',
            to: user.email.email, // list of receivers
            subject: "Change Password",
            text: `Test - http://localhost:3000/user/confirmForgot/${token}`, // Email confirmation link
            /*html: "<b>Hello world?</b>"*/ // html body
        }

        /* forgot token saved to user */
        user.forgotToken.token = token
        createdAt.setHours(createdAt.getHours() + 1)
        user.forgotToken.expiresAt = createdAt

        await user.save()
        await sendMail(mailData)
        return Promise.resolve({status:true,message:'The link to change password has been resent to your email address'})
    
    }
    catch(e){
        return Promise.reject('error')
    }
}

/* Creates a login token for the User */

userSchema.methods.generateToken = function(){
    const user = this
    const tokenData = {
        createdAt:new Date()
    }

    const token = jwt.sign(tokenData,keys.jwtSecret) //PENDING - VULNERABILITY - use CSRPG
    if(user.tokens.length==10){
        user.tokens.length.shift()
    }
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
                        return Promise.reject({status:false,message:'User not found',statusCode:404})
                    }
                    if(user.email.confirmed.value){
                        return Promise.reject({status:false,message:'User already verified',statusCode:401})
                    }
                    user.email.confirmed.value = true
                    return user.save()
                })
                .then(function(user){
                    return Promise.resolve({status:true,message:'Email confirmed successfully'})
                })
                .catch(function(err){
                    return Promise.reject(err)
                })
}

/* To confirm the change in password from the email and also update the new password */

userSchema.statics.confirmPassword = async function(token,password){
    const User = this

    try{
        const user = await User.findOne({'forgotToken.token':token})
        if(!user){
            return Promise.reject({status:false,message:'Invalid password change attempt',statusCode:401})
        }
        if(new Date(user.forgotToken.expiresAt).getTime()<Date.now()){
            return Promise.reject({status:false,message:'Token expired',statusCode:401})
        }
        jwt.verify(token,keys.jwtSecret)
        await user.set('password',password)
        await user.save()
        return Promise.resolve(user)
    }
    catch(e){
        return Promise.reject(e)
    }
}

/* Admin credential middleware check */

userSchema.statics.adminSignAction = async function(email,password,token){
    const User = this

    try{
        const user = await User.findOne({'email.email':email,'isAdmin.token':token})
        if(!user){
            return Promise.reject({status:false,message:'Invalid Attempt',statusCode:401})
        }
        if(!user.isAdmin||!user.isAdmin.value){
            return Promise.reject({status:false,message:'Invalid Attempt',statusCode:401})
        }
        if(user.isAdmin.banned&&user.isAdmin.banned.value){
            return Promise.reject({status:false,message:'Invalid Attempt',statusCode:401})
        }
        const result = await bcryptjs.compare(password,user.password)
        if(result){
            return Promise.resolve(user)
        }
        else{
            return Promise.reject({status:false,message:'Invalid Attempt',statusCode:401})
        }
    }
    catch(e){
        return Promise.reject(e)
    }
}

/* Admin login function */

userSchema.statics.adminLogin = async function(email,password){
    const User = this

    try{
        const user = await User.findOne({'email.email':email})
        if(!user||!user.isAdmin.value){
            return Promise.reject({status:false,message:'Invalid Attempt',statusCode:401})
        }
        if(user.isAdmin.banned&&user.isAdmin.banned.value){
            return Promise.reject({status:false,message:'Invalid Attempt',statusCode:401})
        }
        const result = await bcryptjs.compare(password,user.password)
        if(result){
            return Promise.resolve(user)
        }
        else{
            return Promise.reject({status:false,message:'Invalid Attempt',statusCode:401})
        }
    }
    catch(err){
        return Promise.reject(err)
    }
}

/* Admin login token generation */

userSchema.methods.generateAdminToken = async function(){
    const user = this

    try{
        let tokenData = {
            createdAt:new Date()
        }
    
        const token = jwt.sign(tokenData,keys.jwtSecret) //PENDING - VULNERABILITY - use CSRPG - Expiration

        /* admin token is saved to isAdmin.token not tokens array */
        await user.set('isAdmin.token',token)
        await user.save()
        return Promise.resolve(user.isAdmin.token)
    }
    catch(err){
        return Promise.reject(err)
    }
}

/* Admin token middleware check */

userSchema.statics.findByAdminToken = function(token){
    const User = this

    return User.findOne({'isAdmin.token':token}).lean()
                .then(function(user){
                    if(!user||!user.isAdmin||!user.isAdmin.value||(user.isAdmin.banned&&user.isAdmin.banned.value)){
                        return Promise.reject({status:false,message:'Invalid Attempt',statusCode:401})
                    }
                    return Promise.resolve(user)
                })
                .catch(function(err){
                    return Promise.reject(err)
                })
}

/* UNEDITED - Not from user controller - remove this after this is edited */
/* Helps change the order status and move it to respt. arrays in user */
userSchema.methods.saveOrder = async function(order){
    const user = this

    try{
        user.orders = [...new Set([...user.orders,...order])]
        await user.save()
        return Promise.resolve('Saved')
    }
    catch(e){
        console.log(e)
        return Promise.reject(e)
    }
}

/* Adds,deletes or updates work for the host*/
userSchema.statics.updateWork = async function(reqUser,body,id){
    const User = this

    const reqParams = pick(body,['workId','options'])
    console.log(reqParams)
    
    try{
        let user
        if(reqUser.isAdmin.value){
            user = await User.findById(id)
        }
        else{
            user = reqUser
        }

        const workIndex = user.work.workDetails.findIndex((element)=>{
            return element.workId == reqParams.workId
        })

        if(workIndex!=-1){
            /* deletes the work */
            if(body.select == 'delete'){
                await Option.deleteOne({'_id':user.work.workDetails[workIndex].options})
                user.work.workDetails.splice(workIndex,1)
                await user.save()
                return Promise.resolve({status:true,message:'Work deleted'})
            }

            /* updates the work */
            if(body.select == 'update'){
                const workOption = await Option.findOne({'_id':reqParams.options._id,'userWork':{$exists:false}}).lean()
                delete workOption._id
                const option = Object.assign({},workOption)

                /* Entered Param validation */
                if(reqParams.options.params.length!=option.params.length){
                    return Promise.reject({status:false,message:'Not proper params',statusCode:400})
                }
                else{
                    let check=[];
                    reqParams.options.params.map((param)=>{
                        option.params.map((ele,index)=>{
                            if(ele._id==param._id){ //Checks if all the params in the options and the obtains options are the same (by title)
                                check[index]=true
                            }
                        })
                    })
                    if(check.length!=reqParams.options.params.length){
                        return Promise.reject({status:false,message:'Not proper params',statusCode:400})
                    }
                }
                
                let errorCheck = false
                option.params = option.params.map((param,paramIndex)=>{ //filtering the main work params by Id (if tierType) or saves from the frontend params (non tierType)
                    if(param.tierType){
                        param.values = param.values.filter((value,index)=>{
                            return reqParams.options.params[paramIndex].values.includes((value._id).toString())?true:false
                        })
                    }
                    else if((param.values[0]._id).toString() == reqParams.options.params[paramIndex].values[0]._id){
                        param.values = reqParams.options.params[paramIndex].values
                    }
                    else{
                        errorCheck = true
                    }
                    return param
                })
                option.userWork = id

                if(errorCheck){
                    return Promise.reject({status:false,message:'Not proper params',statusCode:400}) //does not work
                }

                await Option.findByIdAndUpdate(user.work.workDetails[workIndex].options,{...option})

                if(reqUser.isAdmin.value&&body.verified){ //Verifies the work, when admin updates and also adds verified variable as true
                    for(let i=0;i<user.work.workDetails.length;i++){
                        if(user.work.workDetails[i].workId.toString()==reqParams.workId){
                            user.work.workDetails[i].verified = {verifiedBy:reqUser._id,verifiedAt:Date.now()}
                            break;
                        }
                    }
                    await user.save()
                }
                else{//Remove verification when the user is making the update
                    for(let i=0;i<user.work.workDetails.length;i++){
                        if(user.work.workDetails[i].workId.toString()==reqParams.workId){
                            delete user.work.workDetails[i].verified
                            break;
                        }
                    }
                    await user.save()
                }
                return Promise.resolve({status:true,message:'Work Updated'})
            }

            return Promise.reject({status:false,message:'Work already exists',statusCode:403})
        }
        else{
            if(body.select=='Add'){
                const workOption = await Option.findOne({'workId':reqParams.workId,'userWork':{$exists:false}}).lean()
                console.log(workOption)
                delete workOption._id
                const option = new Option(workOption)

                /* Entered Param validation */
                if(reqParams.options.params.length!=option.params.length){
                    return Promise.reject({status:false,message:'Not proper params',statusCode:400})
                }
                else{
                    let check=[];
                    reqParams.options.params.map((param)=>{
                        workOption.params.map((ele,index)=>{
                            if(ele.title==param.title){ //Checks if all the params in the options and the obtains options are the same (by title)
                                check[index]=true
                            }
                        })
                    })
                    if(check.length!=reqParams.options.params.length){
                        return Promise.reject({status:false,message:'Not proper params',statusCode:400})
                    }
                }

                let errorCheck = false
                option.params = option.params.map((param,paramIndex)=>{ //filtering the main work params by Id and adding 
                    if(param.tierType){
                        param.values = param.values.filter((value,index)=>{
                            return reqParams.options.params[paramIndex].values.includes((value._id).toString())?true:false
                        })
                    }
                    else if((param.values[0]._id).toString() == reqParams.options.params[paramIndex].values[0]._id){
                        param.values = reqParams.options.params[paramIndex].values
                    }
                    else{
                        errorCheck = true
                    }
                    return param
                })
                option.userWork = id

                if(errorCheck){
                    return Promise.reject({status:false,message:'Not proper params',statusCode:400}) //does not work
                }

                /* checks permission if user can add multiple works */
                if(user.perms.supplier.multipleWorks.number < user.work.workDetails.length + 1){
                    return Promise.reject({status:false,message:'Contact support to add more inventories',statusCode:403})
                }

                await option.save()
                if(reqUser.isAdmin.value&&body.verified){
                    user.work.workDetails.push({workId:reqParams.workId,options:option,verified:{verifiedBy:reqUser._id,verifiedAt:Date.now()}})
                }
                else{
                    user.work.workDetails.push({workId:reqParams.workId,options:option})
                }
                await user.save()
                return Promise.resolve({status:true,message:'Work Added'})
            }
            return Promise.reject({status:false,message:'Invalid work change attempt',statusCode:403})
        }
    }
    catch(err){
        return Promise.reject(err)
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
                return Promise.reject({status:false,message:`Option doesn't exist`,statusCode:404})
        }
    }
    catch(err){
        return Promise.reject(err)
    }
}

/* checks that a user with forgotToken is present */
userSchema.statics.forgotCheck = async function(token){
    const User = this

    try{
        const user = await User.findOne({'forgotToken.token':token},"_id forgotToken").lean()
        if(user.isAdmin.value){
            return Promise.reject({status:false,message:'Unauthorized',statusCode:401})
        }
        if(user&&new Date(user.forgotToken.expiresAt).getTime()>Date.now()){
            return Promise.resolve({value:true})
        }
        else{
            return Promise.reject({status:false,message:'Unauthorized or expired token',statusCode:401})
        }
    }
    catch(e){
        return Promise.reject(e)
    }
}

/* Find suppliers based on the order inventory requirement */
userSchema.statics.orderSuppliers = async function(workId){
    const User = this

    try{
        let suppliers = await User.find({'work.workDetails':{$elemMatch:{workId:workId,'verified.verifiedBy':{$exists:true,$ne:null}}},'perms.user.suspended.value':false,'perms.user.banned.value':false,'perms.supplier.suspended.value':false,'perms.supplier.banned.value':false,'isAdmin.value':{$exists:false}}).lean() //UNRELIABLE -  use projection
        if(suppliers.length!==0){
            return Promise.resolve({suppliers})
        }
        return Promise.reject({status:false,message:'Unable to find suppliers',statusCode:404})
    }
    catch(e){
        return Promise.reject(e)
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
            from: '"Exvate" <kajaymenon@hotmail.com>',
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

userSchema.statics.assignWork = async function(orderId,supplierId,type){
    const User = this

    try{
        const supplier = await User.findById(supplierId)
        if(type=='assign'){
            if(supplier.perms.supplier.suspended.value||supplier.perms.supplier.banned.value||supplier.perms.user.suspended.value||supplier.perms.user.suspended.value){
                return Promise.reject({status:false,message:'Banned/Suspended supplier',statusCode:403})
            }
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
            return Promise.reject({status:false,message:'User is not assigned the order',statusCode:403})
        }
        else{
            return Promise.reject({status:false,message:'Type not provided',statusCode:403})
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

userSchema.statics.supplierCancel = async function(orderId,reqUser){
    const User = this

    try{
        const order = reqUser.work.workOrder.find(ele=>ele==orderId)
        if(!order){
            return Promise.reject({status:false,message:'Unauthorized',statusCode:401})
        }
        reqUser.work.workOrder = reqUser.work.workOrder.filter(ele=>ele!=orderId)
        const result = await Order.updateOne({_id:order,status:{$nin:['Transit','Completed','Finished','Cancelled','Failed','Active']}},{'verified.value':false,'host.assigned':[],$addToSet:{'host.removed':reqUser._id}})
        if(result.nModified!=0){
            await reqUser.save()
            return Promise.resolve(reqUser)
        }
        else{
            return Promise.reject({status:false,message:'Unable to modify',statusCode:403})
        }
    }
    catch(e){
        console.log(e)
        return Promise.reject(e)
    }
}

userSchema.statics.userEdit = async function(user,body,id){
    const User = this

    let userBody

    if(user.isAdmin.value){
        userBody = pick(body,['name','email.email','mobile','address','userType','supplier'])
    }
    else{
        userBody = pick(body,['name','email.email','mobile','userType','supplier'])
    }

    try{
        if(user.isAdmin.value||user._id==id){
            const user = await User.findByIdAndUpdate(id,{...userBody})
            console.log(user)
            return Promise.resolve('Successfully updated')
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

userSchema.statics.suspend = async function (userId,body,admin){
    const User = this

    try{
        const user = await User.findById(userId)
        body.duration = new Date(body.duration)
        if(user.isAdmin.value&&admin.isAdmin.auth>=user.isAdmin.auth){ //higher auth means lower authorization
            return Promise.reject({status:false,message:'Unauthorized',statusCode:401})
        }
        user.tokens = []
        if(body.action==='suspend'){
            if(body.target=='user'){
                if(user.perms.user.suspended.value){
                    return Promise.reject({status:false,message:'Already under suspension',statusCode:403})
                }
                user.perms.user.suspended = {...user.perms.user.suspended,value:true,duration:body.duration}
                user.perms.user.suspended.details.push({doneBy:admin._id,reason:body.reason})
                console.log(user)
                await user.save()
                return Promise.resolve({status:true,message:'Suspended successfully',statusCode:200})
            }
            else if(body.target=='supplier'){
                if(!user.supplier){
                    return Promise.reject({status:false,message:'Invalid action on user type',statusCode:400})
                }
                if(user.perms.supplier.suspended.value){
                    return Promise.reject({status:false,message:'Already under suspension',statusCode:403})
                }
                user.perms.supplier.suspended = {...user.perms.supplier.suspended,value:true,duration:body.duration}
                user.perms.supplier.suspended.details.push({doneBy:admin._id,reason:body.reason})
                console.log(user)
                await user.save()
                return Promise.resolve({status:true,message:'Suspended successfully',statusCode:200})
            }
            else{
                return Promise.reject({status:false,message:'Invalid Input',statusCode:400})
            }
        }
        else if(body.action==='ban'){
            if(body.target=='user'){
                if(user.isAdmin.value){
                    if(user.isAdmin.banned.value){
                        return Promise.reject({status:false,message:'Already banned',statusCode:403})
                    }
                    user.isAdmin.token = undefined
                    user.isAdmin.banned = {value:true,doneBy:admin._id,createdAt:new Date(),reason:body.reason}
                    console.log(user)
                    await user.save()
                    return Promise.resolve({status:true,message:'Banned successfully',statusCode:200})
                }
                else{
                    if(user.perms.user.banned.value){
                        return Promise.reject({status:false,message:'Already banned',statusCode:403})
                    }
                    user.perms.user.banned = {value:true,doneBy:admin._id,createdAt:new Date(),reason:body.reason}
                    console.log(user)
                    await user.save()
                    return Promise.resolve({status:true,message:'Banned successfully',statusCode:200})
                }
            }
            else if(body.target=='supplier'){
                if(!user.supplier){
                    Promise.reject({status:false,message:'Invalid action on user type',statusCode:400})
                }
                if(user.perms.supplier.banned.value){
                    return Promise.reject({status:false,message:'Already banned',statusCode:403})
                }
                user.perms.supplier.banned = {value:true,doneBy:admin._id,createdAt:new Date(),reason:body.reason}
                console.log(user)
                await user.save()
                return Promise.resolve({status:true,message:'Banned Supplier successfully',statusCode:200})
            }
            else{
                return Promise.reject({status:false,message:'Invalid Input',statusCode:400})
            }
        }
        else{
            return Promise.reject({status:false,message:'Invalid Input',statusCode:400})
        }
    }
    catch(e){
        console.log(e)
        return Promise.reject(e)
    }
}

userSchema.statics.supplierVerify = async function(userId,body,admin){
    const User = this

    try{
        const result = await User.updateOne({_id:userId},{$set:{'perms.supplier.multipleWorks.workCount':body.workCount,'perms.supplier.verified':body.verified},$push:{'perms.supplier.multipleWorks.doneBy':admin._id}})
        if(result.nModified){
            return Promise.resolve({status:true,message:'Modified successfully',statusCode:200})
        }
        else{
            return Promise.reject({status:false,message:'Unable to modify',statusCode:404})
        }
    }
    catch(e){
        console.log(e)
        return Promise.reject(e)
    }
}

userSchema.statics.supplierWorkComplete = async function (userId,orderId){
    const User = this

    try{
        const res = await User.updateOne({_id:userId},{$push:{'work.workHistory':orderId},$pull:{'work.workOrder':orderId}})
        return Promise.resolve(res)
    }
    catch(e){
        return Promise.reject(e)
    }
}

const User = mongoose.model('User',userSchema)

module.exports = User