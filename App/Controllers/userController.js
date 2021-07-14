const User = require('../Models/user')
const pick = require('lodash/pick')
const errorHandler = require('../Resolvers/errorHandler')
const { response } = require('express')

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
            errorHandler(err,next)
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
            res.json({status:true,message:'Successfully logged In', payload: pick(userData,['userType','_id','name','host','email.email'])})
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

/* Show user account details (values gotten from middleware) */

module.exports.account = (req,res) =>{
    let sendUser = pick(req.user,['userType','_id','name','host','email.email'])
    res.json(sendUser)
}

/* User logout */

module.exports.logout = (req,res) =>{

    /* removes the login token */
    User.findByIdAndUpdate(req.user._id,{$pull:{tokens:{token:req.token}}}) 
        .then(function(){
            res.json({status:true,message:'Successfully logged out'})
        })
        .catch(function(err){
            res.json(err)
        })
}

/* User logout all */

module.exports.logoutAll = (req,res,next) =>{

    /* removes the login token */
    User.findByIdAndUpdate(req.user._id,{$set:{tokens:[]}}) 
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

    User.findByEmail(body.email)
        .then(function(user){
            if(user.email.confirmed.value){
                return Promise.reject({status:false,message:'The account is already verified',statusCode:401})
            }
            return user.registerMail() // sends the confirmation email
        })
        .then(function(response){
            res.json({status:true,message:'The registration email has been sent to the address'})
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

/* When the user follows the link in the confirmation email */

module.exports.confirmSignupEmail = (req,res,next) =>{
    const token = req.params.token

    User.confirmEmail(token)
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

/* Admin login function */

module.exports.adminLogin = (req,res,next) =>{
    const body = req.body

    User.adminLogin(body.email,body.password)
            .then(function(user){
                return user.generateAdminToken()
            })
            .then(function(token){
                res.setHeader('x-admin',token).send({})
            })
            .catch(function(err){
                errorHandler(err,next)
            })
}

/* Admin logout function */

module.exports.adminLogout = (req,res,next) =>{
    User.findByIdAndUpdate(req.user._id,{$pull:{isAdmin:{token:req.token}}})
        .then(function(){
            res.json('Successfully logged out')
        })
        .catch(function(err){
            errorHandler(err,next)
        })
}

/* Adding response and reject structure, error handling - this work controller being worked on frontend pending */
/* Adds, deletes or updates a work for the host*/
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

/* UNRELIABLE - Change the Regex search to mongodb atlas search*/
module.exports.all = (req,res) =>{
    const query = req.query
    query.filter = JSON.parse(query.filter)
    query.sort = JSON.parse(query.sort)
    query.range = JSON.parse(query.range)

    if(query.filter.q){
        User.find({'email.email':{$regex:query.filter.q}}).skip(query.range[0]).limit(query.range[1]+1-query.range[0])
            .then(async (users)=>{
                const count = await User.countDocuments({'email.email':{$regex:query.filter.q}})
                return Promise.resolve({users,count})
            })
            .then((users)=>{
                res.setHeader('full',`orders ${query.range[0]}-${query.range[1]}/${users.count}`)
                res.json(users)
            })
            .catch((err)=>{
                console.log(err)
                res.json('Invalid request')
            })
    }
    else{
        User.find({}).skip(query.range[0]).limit(query.range[1]+1-query.range[0])
            .then(async (users)=>{
                const count = await User.countDocuments()
                return Promise.resolve({users,count})
            })
            .then((users)=>{
                res.setHeader('full',`orders ${query.range[0]}-${query.range[1]}/${users.count}`)
                res.json(users.users)
            })
            .catch((err)=>{
                console.log(err)
                res.json('Invalid request')
            })
    }
}

/* ADMIN - Finds the admin by his token - For react admin to verify*/
module.exports.adminToken = (req,res,next) =>{
    const token = req.header('x-admin')

    User.findByAdminToken(token)
        .then((admin)=>{
            res.status(200).send({})
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

/* LAST - ADMIN - Finds all the suppliers for the type of work */
module.exports.suppliers = (req,res,next) =>{
    const orderId = req.params.id
    const body = req.body

    User.orderSuppliers(body.workId)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

/*module.exports.adminCreate = (req,res) =>{    //Usage Temporarily not used
    const body = req.body

    User.adminCreate(body)
        .then((user)=>{
            res.json(user)
        })
        .catch((err)=>{
            console.log(err)
            res.json(err)
        })
}*/

/* ADMIN - Finds the details of the user including his work */
module.exports.details = (req,res,next) =>{
    const id = req.params.id

    User.findById(id).populate('work.workDetails.options') //UNRELIABLE - use projection
        .then((user)=>{
            if(user){
                res.json(user)
            }
            else{
                res.status(404).send('Not found')
            }
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

/* ADMIN - UNRELIABLE - CONFIRM USAGE */
module.exports.workOrders = (req,res) =>{
    const id = req.params.id

    if(req.params.id!=req.user._id&&!req.user.isAdmin.value){
        res.status(401).send('Unauthorized')
    }
    else{
        User.findById(id).populate({path:'work.workOrder',populate:{path:'workId',select:'title'}}) //UNRELIABLE - use projection
            .then((user)=>{
                res.json(user.work.workOrder)
            })
            .catch((e)=>{
                errorHandler(err,next)
            })
    }
}

module.exports.hostCancel = (req,res) =>{
    const orderId = req.params.orderId

    User.hostCancel(orderId,req.user)
        .then((user)=>{
            res.json('Order has been cancelled')
        })
        .catch((e)=>{
            res.json(e)
        })
}

module.exports.userEdit = (req,res,next) =>{
    const user = req.user
    const body = req.body
    const id = req.params.id

    User.userEdit(user,body,id)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.suspend = (req,res,next) =>{
    const admin = req.user
    const userId = req.params.id
    const body = req.body

    User.suspend(userId,body,admin)
        .then((resp)=>{
            res.json(resp)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}

module.exports.supplierVerify = (req,res,next) =>{
    const admin = req.user
    const userId = req.params.id
    const body = req.body

    User.supplierVerify(userId,body,admin)
        .then((resp)=>{
            res.json(resp)
        })
        .catch((err)=>{
            errorHandler(err,next)
        })
}