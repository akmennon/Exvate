const User = require('../Models/user')
const pick = require('lodash/pick')

/* User signup function */

module.exports.create = (req,res) =>{
    const body = req.body
    const bodyPick = pick(body,['name','password','address','email'])
    const user = new User(bodyPick)

    /* confirmation email to verify user's email address */
    user.registerMail()
        .then(function(){
            return user.save()
        })
        .then(function(){
            res.json('Account created ')
            console.log('successful message')
        })
        .catch(function(err){
            console.log(err)
        })
}

/* User Login function */ 

module.exports.login = (req,res) =>{
    const body = req.body
    let users
    User.findByCredentials(body.email,body.password)
        .then(function(user){
            users=user
            return user.generateToken()     // generates a token for logging in
        })
        .then(function(token){
            const user = pick(users,['userType','_id','name','host'])
            user.email = users.email.email
            res.setHeader('x-auth',token) // sends token as a header
            res.json(user)
        })
        .catch(function(err){
            res.json(err)
        })
}

/* Show user account details (values gotten from middleware) */

module.exports.account = (req,res) =>{
    const user = req.user
    let sendUser = pick(user,['userType','_id','name','host'])
    sendUser.email=user.email.email
    res.json(sendUser)
}

/* User logout */

module.exports.logout = (req,res) =>{

    /* removes the login token */
    User.findByIdAndUpdate(req.user._id,{$pull:{tokens:{token:req.token}}}) 
        .then(function(){
            res.json('Successfully logged out')
        })
        .catch(function(err){
            res.json(err)
        })
}

/* Forgot password reset function */

module.exports.forgotPassword = (req,res) =>{
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
            res.json(err)
        })
}

/* function to resend the email verfication email */

module.exports.resendRegisterMail = (req,res) =>{
    const body = req.body

    User.findByEmail(body.email)
        .then(function(user){
            return user.registerMail() // sends the confirmation email
        })
        .then(function(info){
            res.json('Email has been sent to the address')
        })
        .catch(function(err){
            res.json(err)
        })
}

/* When the user follows the link in the conformation email */

module.exports.confirmSignupEmail = (req,res) =>{
    const token = req.params.token

    User.confirmEmail(token)
        .then(function(user){
            if(user){
                res.json({value:true})
            }
            else{
                res.json({value:false})
            }
        })
        .catch(function(err){
            console.log(err)
            res.json(err)
        })
}

/* Lets the user update the password when the verification link is followed */

module.exports.confirmChangePassword = (req,res) =>{
    const token = req.params.token
    const body = req.body

    User.confirmPassword(token,body.password)
            .then(function(user){
                let response = pick(user,['userType','_id','name'])
                response.email = user.email.email
                res.json(response)
            })
            .catch(function(err){
                res.json(err)
            })
}

/* Admin login function */

module.exports.adminLogin = (req,res) =>{
    const body = req.body

    User.adminLogin(body.email,body.password)
            .then(function(user){
                return user.generateAdminToken()
            })
            .then(function(token){
                res.setHeader('x-admin',token).send({})
            })
            .catch(function(err){
                res.json(err)
            })
}

/* Admin logout function */

module.exports.adminLogout = (req,res) =>{
    User.findByIdAndUpdate(req.user._id,{$pull:{isAdmin:{token:req.token}}},{new:true, runValidators:true})
        .then(function(){
            res.json('Successfully logged out')
        })
        .catch(function(err){
            res.json(err)
        })
}

/* Adds, deletes or updates a work for the host*/
module.exports.addWork = (req,res) =>{
    const body = req.body
    const userId = req.params.id

    User.updateWork(userId,body)
        .then((user)=>{
            res.json(user)
        })
        .catch((err)=>{
            console.log(err)
            res.json(err)
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
            res.json(err)
        })
}

module.exports.orders = (req,res) =>{
    const body = req.body
    console.log(body)

    User.orders(req.user._id,req.body)
        .then((orders)=>{
            res.json(orders)
        })
        .catch((err)=>{
            console.log(err)
            res.json(err)
        })
}

/* validates that a user is trying to change password */
module.exports.forgotCheck = (req,res) =>{
    const token = req.header('forgotToken')

    User.forgotCheck(token)
        .then((user)=>{
            if(user){
                res.json({value:true})
            }
            else{
                res.json({value:false})
            }
        })
        .catch((err)=>{
            console.log(err)
            res.json('error finding user')
        })
}

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

module.exports.adminToken = (req,res) =>{
    const token = req.header('x-admin')

    User.findByAdminToken(token)
        .then((admin)=>{
            res.status(200).send({})
        })
        .catch((err)=>{
            console.log(err)
            res.status(401).send(err)
        })
}

module.exports.suppliers = (req,res) =>{
    const orderId = req.params.id

    User.orderSuppliers(orderId)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            console.log(err)
            res.json('Request error')
        })
}

module.exports.adminCreate = (req,res) =>{
    const body = req.body

    User.adminCreate(body)
        .then((user)=>{
            res.json(user)
        })
        .catch((err)=>{
            console.log(err)
            res.json(err)
        })
}

module.exports.details = (req,res) =>{
    const id = req.params.id

    User.findById(id).populate('work.workDetails.options')
        .then((user)=>{
            res.json(user)
        })
        .catch((err)=>{
            console.log(err)
            res.json('Error fetching details')
        })
}

module.exports.workOrders = (req,res) =>{
    const id = req.params.id

    if(req.params.id!=req.user._id&&!req.user.isAdmin.value){
        res.status(401).send('Unauthorized')
    }
    else{
        User.findById(id).populate({path:'work.workOrder',populate:{path:'workId',select:'title'}})
            .then((user)=>{
                res.json(user.work.workOrder)
            })
            .catch((e)=>{
                console.log(e)
                res.json('error fetching orders')
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

module.exports.userEdit = (req,res) =>{
    const user = req.user
    const body = req.body
    const id = req.params.id

    User.userEdit(user,body,id)
        .then((response)=>{
            res.json(response)
        })
        .catch((err)=>{
            res.json(err)
        })
}