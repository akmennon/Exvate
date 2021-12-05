const User = require('../Models/user')
const pick = require('lodash/pick')
const errorHandler = require('../Resolvers/errorHandler')
const Order = require('mongoose').model('Order')

/* Work left : Pick */

/* User signup function */

module.exports.create = (req,res,next) =>{
    const body = req.body
    const bodyPick = pick(body,['name','password','address','email'])
    const user = new User(bodyPick)

    /* confirmation email to verify user's email address */
    user.save()
        .then(function(){
            return user.registerMail()
        })
        .then(function(status){
            res.json(status)
        })
        .catch(function(err){
            console.log(err)
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

/* User Login function */ 

module.exports.login = (req,res,next) =>{
    const body = req.body
    let userData
    User.findByCredentials(body.email,body.password)
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

/* Show user account details (values gotten from middleware) */

module.exports.account = (req,res) =>{
    let sendUser = pick(req.user,['userType','_id','name','supplier','email.email','address'])
    res.json(sendUser)
}

module.exports.profile = (req,res,next) =>{
    const user = req.user
    const body = req.body

    user.sendProfile(body)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

/* User logout */

module.exports.logout = (req,res,next) =>{
    const user = req.user
    const token = req.header('x-auth')

    /* removes the login token */
    console.log('loggedout')
    user.logOut(token)
        .then(function(){
            res.json({status:true,message:'Successfully logged out'})
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

/* User logout all */

module.exports.logoutAll = (req,res,next) =>{

    /* removes the login token */
    User.updateOne(req.user._id,{$set:{tokens:[]}},{runValidators:true}) 
        .then(function(){
            res.json('Successfully logged out of all systems')
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

/* Forgot password reset function */

module.exports.forgotPassword = (req,res,next) =>{
    const body = req.body
    console.log(body)

    User.findByEmail(body.email)
        .then(function(user){
            return user.generateForgotToken() //function to generate token specifically to change the password
        })
        .then(function(result){
            res.json(result)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

/* function to resend the email verfication email */

module.exports.resendRegisterMail = (req,res,next) =>{
    const body = req.body

    User.resendRegisterEmail(body.email)
        .then(function(response){
            res.json({status:true,message:'The registration email has been sent to the address'})
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

/* When the confirms otp */

module.exports.confirmOtp = (req,res,next) =>{
    const token = req.params.token

    User.sendOtp(token,req.body)
        .then(function(response){
            res.json(response)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

/* When the user follows the link in the confirmation email */

module.exports.confirmSignupEmail = (req,res,next) =>{
    const token = req.params.token

    User.confirmEmail(token,req.body)
        .then(function(response){
            res.json(response)
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

/* Lets the user update the password when the verification link is followed */

module.exports.confirmChangePassword = (req,res,next) =>{
    const token = req.params.token
    const body = req.body

    User.confirmPassword(token,body.password)
        .then(function(user){
            let response = pick(user,['userType','_id','name'])
            response.email = user.email.email
            res.json(response) //check only a message is required
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

/*ADMINCHANGE */
/* Adding response and reject structure, error handling - this work controller being worked on frontend pending */
/* Adds, deletes or updates a work for the supplier*/
module.exports.addWork = (req,res,next) =>{
    const body = req.body
    const userId = req.params.id

    User.updateWork(req.user,body,userId)
        .then((user)=>{
            res.json(user)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

/* Finds all work details or orders according to the input */
module.exports.workAll = (req,res) =>{
    const body = req.body

    User.workAll(req.user._id,req.body)
        .then((works)=>{
            res.json(works)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

/* validates the user who is trying to change password */
module.exports.forgotCheck = (req,res,next) =>{
    const token = req.header('forgotToken')

    User.forgotCheck(token)
        .then((value)=>{
            res.json(value)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.supplierCancel = (req,res) =>{
    const orderId = req.params.orderId

    User.supplierCancel(orderId,req.user,Order)
        .then((result)=>{
            res.json(result)
        })
        .catch((e)=>{
            errorHandler(err,next)
        })
}

module.exports.addAddress = (req,res,next) =>{
    const user = req.user
    const address = req.body

    user.addAddress(address)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.removeAddress = (req,res,next) =>{
    const user = req.user
    const addressId = req.params.id

    user.removeAddress(addressId)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
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
    const details = req.body

    user.changeCompanyDetails(details)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.changePassword = (req,res,next) =>{
    const user = req.user
    const passwordDetails = req.body
    const token = req.header('x-auth')

    user.changePassword(passwordDetails,token)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.changeName = (req,res,next) =>{
    const user = req.user
    const body = req.body

    user.changeName(body)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.changeCompanyDetails = (req,res,next) =>{
    const user = req.user
    const body = req.body

    user.changeCompanyDetails(body)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.changeMobile = (req,res,next) =>{
    const user = req.user

    user.changeMobileOtp(req.body)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.confirmMobileChange = (req,res,next) =>{
    const user = req.user

    user.confirmMobileChange(req.body.otp)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}