const mongoose = require('mongoose')
const Validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pick = require('lodash/pick')
const sendMail = require('../Resolvers/sendMail')
const Option = require('./work/optionSubdoc')
const keys = require('../Config/keys')
const client = require('twilio')(keys.twilioSid,keys.twilioAuthToken);
const messageMobile = keys.messageMobile
const delCache = require('../Config/delCache').delCache
const {v4:uuidv4} = require('uuid')

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
            lastSend:{
                type:Date
            },
            value:{             //The value to verify that the email has been confimed
                type:Boolean
            }
        }
    },
    mobile:{
        type:String,
        // unique:true
    },
    mobileVerified:{
        value:{
            type:Boolean,
            default:false
        },
        token:{
            type:String,
            maxlength:6,
            minlength:6
        },
        lastSend:{
            type:Date
        }
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
            type:Date
        }
    },
    address:[{
        name:{
            type:String,
            maxlength:40,
            minlength:3
        },
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
    companyDetails:{
        name:{
            type:String,
            minlength:3,
            maxlength:60
        },
        officeAddress:{
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
        },
        position:{
            type:String,
            maxlength:50,
            minlength:2
        },
        phone:{
            type:String,
            minlength:4,
            maxlength:20
        },
        website:{
            type:String,
            minlength:4,
            maxlength:50
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
        }]
    },
    sampleOrders:[{
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
            sample:{
                max:{
                    type:Number,
                    default:3,
                    min:1,
                    max:10
                }
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
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    profileChangeToken:{
        value:{
            type:String
        },
        createdAt:{
            type:Date
        },
        mobile:{
            token:{
                type:String
            },
            number:{
                type:String
            },
            lastSend:{
                type:Date
            }
        }
    }
    /*,                                //For admin created user
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

    else if(user.isDirectModified('password')){ // checks if the password has been modified and if password reset token exists
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

userSchema.methods.registerMail = async function(redisClient){
    const user = this

    try{
    
        let mailData;
    
        /* checks if the email token is empty (first time) */
        if(!user.email.confirmed.token){
            const createdAt = new Date()

            let tokenData = {
                createdAt:uuidv4()
            }
    
            const token = jwt.sign(tokenData,keys.jwtSecret)

            user.set('email.confirmed.token', token)
            user.set('email.confirmed.lastSend', new Date())

            mailData = {
                from: '"Exvate" <ajaydragonballz@gmail.com>',
                to: user.email.email, // list of receivers
                subject: "Signup email confirmation",
                text: `Test - http://localhost:3000/user/confirmSign/${token}`, // Email confirmation link
                /*html: "<b>Hello world?</b>"*/ // html body
            }

        }
        else{

            if( user.email.confirmed.lastSend&&(new Date(user.email.confirmed.lastSend).getTime() + 60000) > Date.now() ){
                return Promise.reject({status:false,message:"Timeout still active for resend",statusCode:401})
            }

            mailData = {
                from: '"Exvate" <ajaydragonballz@gmail.com>',
                to: user.email.email, // list of receivers
                subject: "Signup email confirmation",
                text: `Click the following link to verify \n\nhttp://localhost:3000/user/confirmSign/${user.email.confirmed.token}`
                /*html: "<b>Hello world?</b>"*/ // html body
            }

            if( user.email.confirmed.lastSend&&(new Date(user.email.confirmed.lastSend).getTime() + 1800000) < Date.now() ){
                const createdAt = new Date()

                let tokenData = {
                    createdAt:uuidv4()
                }
        
                const token = jwt.sign(tokenData,keys.jwtSecret)

                user.set('email.confirmed.token', token)

                mailData = {
                    from: '"Exvate" <ajaydragonballz@gmail.com>',
                    to: user.email.email, // list of receivers
                    subject: "Signup email confirmation",
                    text: `Test - http://localhost:3000/user/confirmSign/${token}`, // Email confirmation link
                    /*html: "<b>Hello world?</b>"*/ // html body
                }
            }
            
            user.set('email.confirmed.lastSend', new Date())
        }
    
        await user.save()
        await sendMail(mailData)
        delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
        return Promise.resolve({status:true,message:'Successfully sent mail'})
    }
    catch(err){
        return Promise.reject(err)
    }
}

userSchema.statics.findByCredentials = async function(email,password,redisClient){
    const User = this

    try{
        const user = await User.findOne({'email.email':email},{'userType':1,'_id':1,'name':1,'supplier':1,'email':1,'address':1,'password':1,'tokens':1,'perms':1})

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

            return Promise.reject({status:false,message:'Incomplete Signup',statusCode:401,payload:{signup:false}})
        }

        await delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
        
        if(user.perms.user.suspended&&user.perms.user.suspended.value){
            if( new Date(user.perms.user.suspended.duration).getTime > Date.now() ){
                return Promise.reject({status:false,message:'User suspended',statusCode:401,payload:{duration:new Date(user.perms.user.suspended.duration)}})
            }
            else{
                perms.user.suspended.value = false,
                perms.user.suspended.duration = undefined
            }  
        }

        if(user.perms.user.banned&&user.perms.user.banned.value){
            if( new Date(user.perms.user.suspended.duration).getTime > Date.now() ){
                return Promise.reject({status:false,message:'User Banned',statusCode:401})
            }
            else{
                perms.user.suspended.value = false,
                perms.user.suspended.duration = undefined
            }  
        }
        
        const result = await bcryptjs.compare(password,user.password)

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

userSchema.statics.findByEmail = function(email,path){
    const User = this

    return User.findOne({'email.email':email},{forgotToken:1,email:1})
                .then(function(user){
                    if(!user){
                        return Promise.reject({status:false,message:'Invalid Attempt',statusCode:401})
                    }
                    return Promise.resolve(user)
                })
                .catch(function(err){
                    return Promise.reject(err)
                })
}

/* Finds the user for whom the login token belongs to */

userSchema.statics.findByToken = async function(token,path,userId,req,res){
    const User = this

    try{
        let user;

        if(!userId||userId=='null'||!Validator.isMongoId(userId)){
            return Promise.reject({status:false,message:`Invalid Attempt`,statusCode:403})
        }
        user = await User.findOne({'tokens.token':token,_id:userId}).cache({hashKey:userId,pathValue:'authUser'})

        if(user){
            if(user.perms.user.suspended&&user.perms.user.suspended.value){
                console.log(new Date(user.perms.user.suspended.duration))
                return Promise.reject({status:false,message:`Under suspension`,statusCode:401})
            }
            else if(user.perms.user.banned&&user.perms.user.banned.value){
                return Promise.reject({status:false,message:`Banned`,statusCode:401})
            }
            else if((user.tokens.find((tokenEle)=>tokenEle.token==token).createdAt.getTime()+900000)<Date.now()&&req.path!='/user/logout'){
                const tokenData = {
                    createdAt:uuidv4()
                }
                const newToken = jwt.sign(tokenData, keys.jwtSecret,{expiresIn:'1h'})
                delCache({hashKey:userId,pathValue:'authUser'},req.app.locals.redisClient)
                user.tokens = user.tokens.filter((tokenEle)=>tokenEle.token!=token)
                user.tokens.push({token:newToken})
                await user.save()
                const tokenArray = newToken.split('.')
                res.setHeader('x-auth',tokenArray[0]+'.'+tokenArray[1])
                res.cookie('auth',tokenArray[2],{expires:new Date(Date.now()+900000),httpOnly:true/*,domain:"localhost:3000",secure:true*/})
                return Promise.resolve({user,token:newToken})
            }
            else{
                return Promise.resolve({user,token})
            }
        }
        else{
            if(path=='/user/logout'){
                return Promise.resolve({status:true,message:`Successfully logged out`})
            }
            return Promise.reject({status:false,message:`Unauthorized`,statusCode:401})
        }
    }
    catch(err){
        return Promise.reject(err)
    }
}

userSchema.methods.supplierCheck = async function (){
    const user = this

    try{
        if(!user.supplier){
            return Promise.reject({status:false,message:'Not a supplier',statusCode:401})
        }
        if(!user.perms.supplier.verified){
            return Promise.reject({status:false,message:'Not a verified supplier. Contact support',statusCode:401})
        }
        if(user.perms.supplier.banned.value){
            return Promise.reject({status:false,message:'Supplier is banned',statusCode:401})
        }
        if(user.perms.supplier.suspended.value){
            const suspendedDate = new Date(user.perms.supplier.suspended.duration)
            if(suspended.getTime()<new Date().getTime()){
                user.perms.supplier.suspended.value = false
                user.perms.supplier.suspended.duration = undefined
                await user.save()
                return Promise.resolve('Suspension cleared')
            }
            return Promise.reject({status:false,message:`Supplier is suspended till ${suspendedDate.toUTCString()}`,statusCode:401})
        }
    }
    catch(e){
        return Promise.reject(e)
    }
}

/* Creates token to change the Password and sends the email with link */

userSchema.methods.generateForgotToken = async function(redisClient){
    const user = this
    
    try{
        const createdAt = new Date()

        const tokenData = {createdAt:uuidv4()}

        if(user.forgotToken&&user.forgotToken.token&&user.forgotToken.expiresAt&&new Date(user.forgotToken.expiresAt).getTime()>Date.now()){
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
        delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
        return Promise.resolve({status:true,message:'The link to change password has been resent to your email address'})
    }
    catch(e){
        return Promise.reject(e)
    }
}

/* Creates a login token for the User */

userSchema.methods.generateToken = async function(){
    const user = this

    const tokenData = {
        createdAt:uuidv4()
    }

    try{

        if(user.tokens.length>=5){
            user.tokens.shift()
        }

        const token = jwt.sign(tokenData,keys.jwtSecret)

        user.tokens.push({token})
        await user.save()
        return Promise.resolve(token)
    }
    catch(e){
        return Promise.reject(err)
    }
}

/* Send the otp for mobile verification for account registration */

userSchema.statics.sendOtp = async function (token,body,redisClient) {
    const User = this

    let user;

    try{

        user = await User.findOne({'email.confirmed.token':token},{mobileVerified:1,mobile:1})

        if(!user){
            return Promise.reject({status:false,message:'User not found',statusCode:404})
        }

        if(user.mobileVerified&&user.mobileVerified.value){
            return Promise.resolve({status:true,message:'Mobile already verified'})
        }

        const lastSendValue = user.mobileVerified&&user.mobileVerified.lastSend? new Date(user.mobileVerified.lastSend).getTime()+60000 : undefined

        if( user.mobileVerified && user.mobileVerified.lastSend &&  (lastSendValue > Date.now()) ){
            return Promise.reject({status:false,message:'Time limit not ended',statusCode:401})
        }

        user.mobile = body.mobile
        user.mobileVerified.lastSend = Date.now()
        user.mobileVerified.token = ('' + Math.random()).slice(2,8)
        await user.save()

        await client.messages.create({
            body: `The code to register your Exvate account is ${user.mobileVerified.token}`,
            from: messageMobile,
            to: user.mobile
        })
        delCache({hashKey:user._id,pathValue:'authUser'},redisClient)

        return Promise.resolve({status:true,message:'Successfully send otp'})
    }
    catch(e){
        user.mobileVerified.lastSend = undefined    //move this to redis
        await user.save()
        return Promise.reject(e)
    }
}

/* confirms the email when the link from the verification email is followed */

userSchema.statics.confirmEmail = async function(token,body,redisClient){
    const User = this

    try{
        const user = await User.findOne({'email.confirmed.token':token},{email:1,mobile:1,mobileVerified:1,companyDetails:1,supplier:1,userType:1,tokens:1})

        if(!user){
            return Promise.reject({status:false,message:'User not found',statusCode:404})
        }

        if(user.email.confirmed.value){
            return Promise.reject({status:false,message:'User already verified',statusCode:401})
        }

        if(user.mobile != body.phone){
            return Promise.reject({status:false,message:'Mobile does not match',statusCode:401})
        }

        if(user.mobileVerified && user.mobileVerified.token != body.otp){
            return Promise.reject({status:false,message:'Incorrect OTP',statusCode:401})
        }

        const lastSendValue = user.mobileVerified&&user.mobileVerified.lastSend? new Date(user.mobileVerified.lastSend).getTime()+3600000 : undefined

        if( user.mobileVerified && user.mobileVerified.lastSend &&  ( !lastSendValue || ( lastSendValue < Date.now()) ) ){
            return Promise.reject({status:false,message:'Expired OTP',statusCode:401})
        }

        if(body.userType=='buyer'){
            
            const companyDetails = pick(body,['country','state','companyName','city','street','userType','phone','pin'])

            user.companyDetails = {
                name:companyDetails.companyName,
                officeAddress:{
                    street:companyDetails.street,
                    city:companyDetails.city,
                    state:companyDetails.state,
                    country:companyDetails.country,
                    pin:companyDetails.pin
                }
            }

        }
        else if(body.userType=='supplier'||body.userType=='both'){

            const companyDetails = pick(body,['country','state','companyName','city','street','userType','phone','website','pin','position'])

            user.companyDetails = {
                name:companyDetails.companyName,
                position:companyDetails.position,
                website:companyDetails.website,
                officeAddress:{
                    street:companyDetails.street,
                    city:companyDetails.city,
                    state:companyDetails.state,
                    country:companyDetails.country,
                    pin:companyDetails.pin
                }
            }

            user.supplier = true
            user.userType = 'Supplier'
        }

        user.mobileVerified.value = true
        user.email.confirmed.value = true

        const tokenData = {
            createdAt:uuidv4()
        }

        const emailToken = jwt.sign(tokenData,keys.jwtSecret) //PENDING - VULNERABILITY - use CSRPG

        if(user.tokens.length==10){
            user.tokens.length.shift()
        }

        user.tokens.push({token:emailToken})

        delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
        await user.save()
        return Promise.resolve({status:true,message:'Signup completed successfully',payload:{token:emailToken,user:user._id}})
    }
    catch(err){
        return Promise.reject(err)
    }
}

/* To confirm the change in password from the email and also update the new password */

userSchema.statics.confirmPassword = async function(token,password,redisClient){
    const User = this

    try{
        const user = await User.findOne({'forgotToken.token':token},{forgotToken:1,password:1,userType:1,_id:1,name:1,'email.email':1})
        if(!user){
            return Promise.reject({status:false,message:'Invalid password change attempt',statusCode:401})
        }
        if(new Date(user.forgotToken.expiresAt).getTime()<Date.now()){
            return Promise.reject({status:false,message:'Token expired',statusCode:401})
        }
        jwt.verify(token,keys.jwtSecret)
        await user.set('password',password)
        await user.save()
        delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
        return Promise.resolve(user)
    }
    catch(e){
        return Promise.reject(e)
    }
}

/* Adds,deletes or updates work for the supplier*/
userSchema.statics.updateWork = async function(reqUser,body,redisClient){
    const User = this

    const reqParams = pick(body,['workId','options'])

    try{
        let user = reqUser

        if(user.perms.user.suspended.value||user.perms.user.banned.value){
            return Promise.reject({status:false,message:'The User is suspended or banned',statusCode:403})
        }

        const workIndex = user.work.workDetails.findIndex((element)=>{
            return element.workId == reqParams.workId
        })

        if(workIndex!=-1){
            /* deletes the work */
            if(body.select == 'delete'){
                await Option.deleteOne({'_id':user.work.workDetails[workIndex].options})
                user.work.workDetails.splice(workIndex,1)
                delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
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
                option.userWork = reqUser._id.toString()

                if(errorCheck){
                    return Promise.reject({status:false,message:'Not proper params',statusCode:400}) //does not work
                }

                await Option.updateOne(user.work.workDetails[workIndex].options,{...option},{runValidators:true})

                for(let i=0;i<user.work.workDetails.length;i++){
                    if(user.work.workDetails[i].workId.toString()==reqParams.workId){
                        delete user.work.workDetails[i].verified
                        break;
                    }
                }
                delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
                await user.save()
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
                option.userWork = reqUser._id.toString()

                if(errorCheck){
                    return Promise.reject({status:false,message:'Not proper params',statusCode:400}) //does not work
                }

                /* checks permission if user can add multiple works */
                if(user.perms.supplier.multipleWorks.number < user.work.workDetails.length + 1){
                    return Promise.reject({status:false,message:'Contact support to add more inventories',statusCode:403})
                }

                await option.save()
                user.work.workDetails.push({workId:reqParams.workId,options:option})
                delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
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
userSchema.methods.workAll = async function (){
    const user = this

    try{
        return Promise.resolve(user.work.workDetails)
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
        if(user&&user.forgotToken.expiresAt.getTime()>Date.now()){
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

userSchema.statics.supplierCancel = async function(orderId,user,Order){

    try{

        const result = await Order.updateOne(
        {
            'supplier.assigned':{$ne:user._id},
            '_id':orderId,
            'status':{$nin:['Transit','Completed','Finished','Cancelled','Failed','Active']}
        },
        [
            {
                $set:{
                    'verified.value':false,
                    'supplier.removed':{
                        $cond:[
                            {$in:[mongoose.Types.ObjectId(user._id),'$supplier.removed']},
                            '$supplier.removed',
                            {$concatArrays:['$supplier.removed',[mongoose.Types.ObjectId(user._id)]]}
                        ]
                    }
                }
            },
            {
                $unset:'supplier.assigned'
            }
        ])

        if(result.nModified!=0&&result.ok!=0){
            return Promise.resolve({status:true,message:'Cancelled order successfully'})
        }
        else{
            return Promise.reject({status:false,message:'Unable to modify',statusCode:403})
        }
    }
    catch(e){
        return Promise.reject(e)
    }
}

userSchema.methods.addAddress = async function (newAddress,redisClient) {
    const user = this

    try{

        if(user.address.length>=10){
            user.address.shift()
        }
        
        user.address.push(newAddress)
        delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
        await user.save()
        return Promise.resolve(user.address[user.address.length-1])
    }
    catch(e){
        return Promise.reject({status:false,message:'Error adding address',statusCode:500})
    }
}

userSchema.methods.removeAddress = async function (addressId,redisClient) {
    const user = this

    try{
        if(user.address.length==0||!user.address.find(ele=>ele._id==addressId)){
            return Promise.reject({status:false,message:'Unauthorized',statusCode:403})
        }
        user.address = user.address.filter((ele)=>ele._id!=addressId)
        await user.save()
        delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
        return Promise.resolve({status:true,message:'Address successfully removed'})
    }
    catch(e){
        return Promise.reject({status:false,message:'Error adding address',statusCode:500})
    }
}

userSchema.methods.getCompanyDetails = async function () {
    const user = this

    try{
        if(!user.companyDetails||!user.companyDetails.name){
            return Promise.reject({status:false,message:'No details available',statusCode:404})
        }
        return Promise.resolve(user.companyDetails)
    }
    catch(e){
        return Promise.reject({status:false,message:'Error adding address',statusCode:500})
    }
}

userSchema.methods.changePassword = async function (passwordDetails,token,redisClient){
    const user = this

    try{

        const result = await bcryptjs.compare(passwordDetails.oldPassword,user.password)

        if(!result){
            return Promise.reject({status:false,message:'Invalid Attempt',statusCode:403})
        }

        user.set('password',passwordDetails.newPassword)
        user.tokens = user.tokens.filter((tokenData)=>{
            return tokenData.token.toString() == token
        })
        await user.save()
        delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
        return Promise.resolve({status:true,message:'Password changed successfully'})
    }
    catch(e){
        return Promise.reject(e)
    }
}

userSchema.methods.changeName = async function (body,redisClient){
    const user = this

    try{
        user.name = body.name
        await user.save()
        delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
        return Promise.resolve({status:true,message:'Name changed successfully'})
    }
    catch(e){
        return Promise.reject(e)
    }
}

userSchema.methods.logOut = async function (token,redisClient,User){
    const user = this

    try{
        if(!token){
            return Promise.reject({status:false,message:'Invalid Attempt',statusCode:403})
        }

        const tokens = user.tokens.filter((ele)=>{
            return ele.token != token
        })
    
        await delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
        await User.updateOne({_id:user._id},{$set:{tokens:tokens}})
        return Promise.resolve({status:true,message:'Successfully logged out'})
    }
    catch(e){
        return Promise.reject(e)
    }
}

userSchema.methods.changeCompanyDetails = async function (body,redisClient){
    const user = this

    try{
        const companyDetails = pick(body,['name','position','website'])
        companyDetails.officeAddress = pick(body.officeAddress,['street','city','state','country','pin'])

        user.companyDetails = companyDetails
        user.mobile = body.phone
        await user.save()
        delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
        return Promise.resolve({status:true,message:'Successfully changed company details'})
    }
    catch(e){
        return Promise.reject(e)
    }
}

userSchema.methods.sendProfile = async function (body,path,redisClient,User){
    const user = this

    try{

        const result = await bcryptjs.compare(body.password,user.password)

        if(!result){
            return Promise.reject({status:false,message:'Unauthorized',statusCode:401})
        }

        const response = pick(user,['_id,','name','email.email','mobile','address','companyDetails','userType','supplier','profileChangeToken.value','profileChangeToken.createdAt'])

        if(user.profileChangeToken.createdAt&&((new Date(user.profileChangeToken.createdAt).getTime()+1800000)-Date.now())>600000){
            return Promise.resolve(response)
        }

        const token = jwt.sign({createdAt:new Date()},keys.jwtSecret)
        await User.updateOne({_id:user._id},{$set:{"profileChangeToken.value":token,"profileChangeToken.createdAt":Date.now()}})
        delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
        return Promise.resolve(response)
    }
    catch(e){
        return Promise.reject(e)
    }
}

userSchema.methods.changeMobileOtp = async function(body,redisClient){
    const user = this

    try{
        const mobile = body.mobile

        if(mobile==user.mobile){
            return Promise.reject({status:false,message:'Same mobile number',statusCode:401})
        }

        if(user.profileChangeToken.mobile.token && ( (new Date(user.profileChangeToken.mobile.lastSend).getTime()+60000) > Date.now())){
            return Promise.reject({status:false,message:'Time limit not reached',statusCode:401})
        }

        user.profileChangeToken.mobile.number = mobile
        user.profileChangeToken.mobile.lastSend = Date.now()
        user.profileChangeToken.mobile.token = ('' + Math.random()).slice(2,8)
        delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
        await user.save()

        await client.messages.create({
            body: `The code to change your mobile number is ${user.profileChangeToken.mobile.token}`,
            from: messageMobile,
            to: user.profileChangeToken.mobile.number
        })
    }
    catch(e){
        return Promise.reject(e)
    }
}

userSchema.methods.confirmMobileChange = async function(otp,redisClient){
    const user = this

    try{
        if(otp!=user.profileChangeToken.mobile.token){
            return Promise.reject({status:false,message:'Invalid Attempt',statusCode:401})
        }

        if(user.profileChangeToken.mobile.token && ( (new Date(user.profileChangeToken.mobile.lastSend).getTime()+1800000) < Date.now())){
            return Promise.reject({status:false,message:'OTP Expired',statusCode:401})
        }

        user.mobile = user.profileChangeToken.mobile.number
        user.profileChangeToken.mobile = undefined
        delCache({hashKey:user._id,pathValue:'authUser'},redisClient)
        await user.save()
        return Promise.resolve({status:true,message:'Mobile changed successfully'})
    }
    catch(e){
        return Promise.reject(e)
    }
}

userSchema.statics.resendRegisterEmail = async function (email){
    const User = this

    try{
        const user = await User.findByEmail(email)

        if(!user){
            return Promise.reject({status:false,message:"Invalid",statusCode:401})
        }

        if(user.email.confirmed.value){
            return Promise.reject({status:false,message:'The account is already verified',statusCode:401})
        }

        return user.registerMail() // sends the confirmation email

    }
    catch(e){
        return Promise.resolve(e)
    }
}

const User = mongoose.model('User',userSchema)

module.exports = User