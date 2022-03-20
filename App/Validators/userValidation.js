const {body,param,header} = require('express-validator')
const isStrongPassword = require('validator/lib/isStrongPassword')

const passwordStrength = (value,{req}) =>{
    const score = isStrongPassword(value,{ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, returnScore: false, pointsPerUnique: 1, pointsPerRepeat: 0.5, pointsForContainingLower: 10, pointsForContainingUpper: 10, pointsForContainingNumber: 10, pointsForContainingSymbol: 10 })
    if(score<4){
        return false
    }
    else{
        return true
    }
}

module.exports.create = [
    body('name','Invalid input').exists({checkFalsy:true,checkNull:true}).withMessage('Please provide a valid name').isString().trim().isLength({min:2}),
    body('password','Invalid input').exists({checkFalsy:true,checkNull:true}).withMessage('Please provide a valid password').isString().trim().custom(passwordStrength).withMessage('The password must contain at least a minimum of 8 characters, a lowercase, an uppercase and a number'),
    body('confirmPassword','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().custom((value,{req})=>req.password==req.confirmPassword).withMessage("Password doesn't match"),
    body('email.email','Invalid input').exists({checkFalsy:true,checkNull:true}).withMessage('Please provide a valid email address').isString().trim().isLength({min:6}).normalizeEmail()
]

module.exports.login = [
    body('password','Invalid input').exists({checkFalsy:true,checkNull:true}).withMessage('Please provide a valid password').isString().trim().custom(passwordStrength),
    body('email','Invalid input').exists({checkFalsy:true,checkNull:true}).withMessage('Please provide a valid email address').isString().trim().isLength({min:6}).normalizeEmail()
]

module.exports.profile = [
    body('password','Invalid input').exists({checkFalsy:true,checkNull:true}).withMessage('Please provide a valid password').isString().trim().custom(passwordStrength)
]

module.exports.forgotPassword = [
    body('email','Invalid input').exists({checkFalsy:true,checkNull:true}).withMessage('Please provide a valid email address').isString().trim().isLength({min:6}).normalizeEmail()
]

module.exports.resendRegisterMail = [
    body('email','Invalid input').exists({checkFalsy:true,checkNull:true}).withMessage('Please provide a valid email address').isString().trim().isLength({min:6}).normalizeEmail()
]

module.exports.confirmOtp = [
    param('token','Unauthorized').exists({checkFalsy:true,checkNull:true}).trim().isJWT(),
    body('mobile','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isMobilePhone('any',{strictMode:true}).withMessage('Please provide a valid mobile number')
]

module.exports.confirmSignupEmail = [
    param('token','Unauthorized').exists({checkFalsy:true,checkNull:true}).trim().isJWT(),
    body('phone','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isMobilePhone('any',{strictMode:true}).withMessage('Please provide a valid mobile number'),
    body('otp','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:6,max:6}),
    body('userType','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isIn(['buyer','supplier','both']),
    body('country','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),//country validation
    body('state','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),//region validation
    body('companyName','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
    body('city','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
    body('street','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
    body('pin','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}).withMessage('Invalid postal code'),//validate postal code
    body('website','Invalid input').optional().custom((value,{req})=>req.userType=='supplier'||req.userType=='both').bail().exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}).isURL(),
    body('position','Invalid input').optional().custom((value,{req})=>req.userType=='supplier'||req.userType=='both').bail().exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2})
]

module.exports.confirmChangePassword = [
    param('token','Unauthorized').exists({checkFalsy:true,checkNull:true}).trim().isJWT(),
    body('password','Invalid input').exists({checkFalsy:true,checkNull:true}).withMessage('Please provide a valid password').isString().trim().custom(passwordStrength),
    body('confirmPassword','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().custom((value,{req})=>req.password==req.confirmPassword).withMessage("Password doesn't match")
]

module.exports.forgotCheck = [
    header('forgotToken','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).trim().isJWT()
]

module.exports.supplierCancel = [
    param('orderId','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).trim().isMongoId()
]

module.exports.addAddress = [
    body('state','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
    body('name','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
    body('city','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
    body('country','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
    body('pin','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}).withMessage('Invalid postal code'),//validate postal code
    body('street','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2})
]

module.exports.removeAddress = [
    param('id','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).trim().isMongoId()
]

module.exports.changeCompanyDetails = [
    body('name','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
    body('website','Invalid input').optional().custom((value,{req})=>req.userType=='supplier'||req.userType=='both').bail().exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}).isURL(),
    body('position','Invalid input').optional().custom((value,{req})=>req.userType=='supplier'||req.userType=='both').bail().exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
    body('phone','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isMobilePhone('any',{strictMode:true}).withMessage('Please provide a valid mobile number'),
    body('officeAddress.street','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
    body('officeAddress.city','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
    body('officeAddress.state','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
    body('officeAddress.country','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
    body('officeAddress.pin','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2})
]

module.exports.changePassword = [
    header('x-auth','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).isString().trim(),
    body('oldPassword','Invalid input').exists({checkFalsy:true,checkNull:true}).withMessage('Please provide a valid password').isString().trim().custom(passwordStrength),
    body('newPassword','Invalid input').exists({checkFalsy:true,checkNull:true}).withMessage('Please provide a valid password').isString().trim().custom(passwordStrength),
    body('confirmPassword','Invalid input').exists({checkFalsy:true,checkNull:true}).withMessage('Please provide a valid password').custom((value,{req})=>value==req.body.newPassword).withMessage("Password doesn't match").isString().trim()
]

module.exports.changeName = [
    body('name','Invalid input').exists({checkFalsy:true,checkNull:true}).withMessage('Please provide a valid name').isString().trim().isLength({min:3})
]

module.exports.changeMobile = [
    body('mobile','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isMobilePhone('any',{strictMode:true}).withMessage('Please provide a valid mobile number')
]

module.exports.confirmMobileChange = [
    body('otp','Invalid input').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:6,max:6})
]