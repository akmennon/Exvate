const User = require('../Models/user')
const pick = require('lodash/pick')
const errorHandler = require('../Resolvers/errorHandler')
const Order = require('../Models/order')
const {matchedData} = require('express-validator')
const validationErrors = require('../Resolvers/validationErrors')
const delCache = require('../Config/cache').delCache

/* User signup function */

module.exports.create = (req,res,next) =>{
    const result = validationErrors(req,next)
    const body = matchedData(req, { locations: ['body'], includeOptionals: true })
    const redisClient = req.app.locals.redisClient

    if(result.status){
        const user = new User(body)

        /* confirmation email to verify user's email address */
        user.save()
            .then(function(){
                return user.registerMail(redisClient)
            })
            .then(function(status){
                res.json(status)
            })
            .catch(function(err){
                if(err.keyPattern['email.email']==1){
                    const error = new Error('User already exists')
                    error.statusCode = 401
                    errorHandler(error,next)
                }
                else{
                    errorHandler(err,next)
                }
            })
    }
    else{
        errorHandler(result,next)
    }
}

/* User Login function */ 

module.exports.login = (req,res,next) =>{
    const result = validationErrors(req,next) //PENDING - undo commenting out input validation
    const body = matchedData(req, { locations: ['body'], includeOptionals: true })

    if(result.status){
        let userData
        User.findByCredentials(body.email,req.body.password,req.app.locals.redisClient)
            .then(function(user){
                userData=user
                return user.generateToken()     // generates a token for logging in
            })
            .then(function(token){
                res.setHeader('x-auth',token) // sends token as a header
                res.json({status:true,message:'Successfully logged In', payload: pick(userData,['userType','_id','name','supplier','email.email','address'])})
            })
            .catch(function(err){
                errorHandler(err,next)
            })
    }
    else{
        errorHandler(result,next)
    }
}

/* Show user account details (values gotten from middleware) */

module.exports.account = (req,res) =>{
    let sendUser = pick(req.user,['userType','_id','name','supplier','email.email','address'])
    res.json(sendUser)
}

module.exports.profile = (req,res,next) =>{
    const result = validationErrors(req,next)
    const body = matchedData(req, { locations: ['body'], includeOptionals: true })
    const user = req.user

    if(result.status){
        user.sendProfile(body,req.path,req.app.locals.redisClient,User)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

/* User logout */

module.exports.logout = (req,res,next) =>{
    const user = req.user
    const token = req.header('x-auth')

    /* removes the login token */
    user.logOut(token,req.app.locals.redisClient,User)
        .then(function(){
            res.json({status:true,message:'Successfully logged out'})
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

/* User logout all */

module.exports.logoutAll = (req,res,next) =>{
    const user = req.user

    User.updateOne({_id:req.user._id.toString()},{$set:{tokens:[]}},{runValidators:true}) 
        .then(function(){
            delCache({hashKey:req.user._id.toString(),pathValue:'authUser'})
            res.json({status:true,message:'Successfully logged out of all systems'})
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

/* Forgot password reset function */

module.exports.forgotPassword = (req,res,next) =>{
    const result = validationErrors(req,next)
    const body = matchedData(req, { locations: ['body'], includeOptionals: true })

    if(result.status){
        User.findByEmail(body.email,req.path)
        .then(function(user){
            return user.generateForgotToken(req.app.locals.redisClient) //function to generate token specifically to change the password
        })
        .then(function(result){
            res.json(result)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

/* function to resend the email verfication email */

module.exports.resendRegisterMail = (req,res,next) =>{
    const result = validationErrors(req,next)
    const body = matchedData(req, { locations: ['body'], includeOptionals: true })

    if(result.status){
        User.resendRegisterEmail(body.email)
        .then(function(response){
            res.json({status:true,message:'The registration email has been sent to the address'})
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

/* When the confirms otp */

module.exports.confirmOtp = (req,res,next) =>{
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['params','body'], includeOptionals: true })

    if(result.status){
        User.sendOtp(data.token,data,req.app.locals.redisClient)
        .then(function(response){
            res.json(response)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

/* When the user follows the link in the confirmation email */

module.exports.confirmSignupEmail = (req,res,next) =>{ //Country,Region,pin validation pending
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['params','body'], includeOptionals: true })

    if(result.status){
        User.confirmEmail(data.token,data,req.app.locals.redisClient)
            .then(function(response){
                res.json(response)
            })
            .catch(function(err){
                errorHandler(err,next)
            })
    }
    else{
        errorHandler(result,next)
    }
}

/* Lets the user update the password when the verification link is followed */

module.exports.confirmChangePassword = (req,res,next) =>{
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['params','body'], includeOptionals: true })

    if(result.status){
        User.confirmPassword(data.token,data.password,req.app.locals.redisClient)
        .then(function(user){
            let response = pick(user,['userType','_id','name'])
            response.email = user.email.email
            res.json(response) //check only a message is required
        })
        .catch(function(err){
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

/* Adds, deletes or updates a work for the supplier*/
module.exports.addWork = (req,res,next) =>{
    const body = req.body

    User.updateWork(req.user,body,req.app.locals.redisClient)
        .then((user)=>{
            res.json(user)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

/* Finds all work details or orders according to the input */
module.exports.workAll = (req,res) =>{
    const user = req.user

    user.workAll(req.user._id.toString())
        .then((works)=>{
            res.json(works)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

/* validates the user who is trying to change password */
module.exports.forgotCheck = (req,res,next) =>{
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['headers'], includeOptionals: true })

    if(result.status){
        if(!data.forgottoken){
            const error = new Error("error")
            errorHandler(error,next)
        }
        else{
            User.forgotCheck(data.forgottoken)
            .then((value)=>{
                res.json(value)
            })
            .catch((err)=>{
                errorHandler(err,next)
            })
        }
    }
    else{
        errorHandler(result,next)
    }
}

module.exports.supplierCancel = (req,res) =>{
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['params'], includeOptionals: true })

    if(result.status){
        User.supplierCancel(data.orderId,req.user,Order)
        .then((result)=>{
            res.json(result)
        })
        .catch((e)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

module.exports.addAddress = (req,res,next) =>{
    const user = req.user
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['body'], includeOptionals: true })

    if(result.status){
        user.addAddress(data,req.app.locals.redisClient)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

module.exports.removeAddress = (req,res,next) =>{
    const user = req.user
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['params'], includeOptionals: true })

    if(result.status){
        user.removeAddress(data.id,req.app.locals.redisClient)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

module.exports.companyDetails = (req,res,next) =>{
    const user = req.user

    user.getCompanyDetails()
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.changeCompanyDetails = (req,res,next) =>{
    const user = req.user
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['body'], includeOptionals: true })

    if(result.status){
        user.changeCompanyDetails(data,req.app.locals.redisClient)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

module.exports.changePassword = (req,res,next) =>{
    const user = req.user
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['body','header'], includeOptionals: true })

    if(result.status){
        user.changePassword(passwordDetails,data['x-auth'],req.app.locals.redisClient)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

module.exports.changeName = (req,res,next) =>{
    const user = req.user
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['body'], includeOptionals: true })

    if(result.status){
        user.changeName(data,req.app.locals.redisClient)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

module.exports.changeCompanyDetails = (req,res,next) =>{
    const user = req.user
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['body'], includeOptionals: true })

    if(result.status){
        user.changeCompanyDetails(data)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

module.exports.changeMobile = (req,res,next) =>{
    const user = req.user
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['body'], includeOptionals: true })

    if(result.status){
        user.changeMobileOtp(data,req.app.locals.redisClient)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}

module.exports.confirmMobileChange = (req,res,next) =>{
    const user = req.user
    const result = validationErrors(req,next)
    const data = matchedData(req, { locations: ['body'], includeOptionals: true })

    if(result.status){
        user.confirmMobileChange(data.otp,req.app.locals.redisClient)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
    }
    else{
        errorHandler(result,next)
    }
}