const express = require('express')
const router = express.Router()

/*-------------------- Controllers --------------------*/

const users = require('../Controllers/userController')
const types = require('../Controllers/typeController')
const categories = require('../Controllers/categoryController')
const works = require('../Controllers/workController')
const orders = require('../Controllers/orderController')
const bids = require('../Controllers/bidController')

/*-------------------- Middlewares --------------------*/

/* For profile edit verification */
const profileEdit = require('../Middlewares/profileEdit')

/* To check if the supplier is verified and not banned,suspended etc */

const supplierCheck = require('../Middlewares/supplierCheck')

/*-------------------- Validators --------------------*/

const usersValidator = require('../Validators/userValidation')
const workValidator = require('../Validators/workValidation')
const orderValidator = require('../Validators/orderValidation')
const typeValidator = require('../Validators/typeValidation')
const categoryValidator = require('../Validators/categoryValidation')
const bidValidator = require('../Validators/bidValidation')

/*-------------------- Routes --------------------*/

router.post('/user/signup',usersValidator.create,users.create)
router.post('/user/login',usersValidator.login,users.login)
router.get('/user/account',users.account)
router.post('/user/profile',usersValidator.profile,users.profile)
router.get('/user/logout',users.logout)
router.get('/user/logoutAll',users.logoutAll)
router.post('/user/forgotPassword',usersValidator.forgotPassword,users.forgotPassword)
router.post('/user/resendRegisterMail',usersValidator.resendRegisterMail,users.resendRegisterMail)
router.post('/user/confirmSign/:token',usersValidator.confirmSignupEmail,users.confirmSignupEmail)
router.post('/user/forgotCheck',usersValidator.forgotCheck,users.forgotCheck)
router.post('/user/confirmForgot/:token',usersValidator.confirmChangePassword,users.confirmChangePassword)
router.post('/user/addAddress',usersValidator.addAddress,users.addAddress)
router.post('/user/removeAddress/:id',usersValidator.removeAddress,users.removeAddress)
router.get('/supplier/:id/workOrders',supplierCheck,orderValidator.workOrders,orders.workOrders)
router.post('/supplier/orders/:orderId/cancel',supplierCheck,usersValidator.supplierCancel,users.supplierCancel)
router.get('/categories/all',categoryValidator.all,categories.all)
router.get('/types/all',typeValidator.all,types.all)
router.get('/works/:id',workValidator.detail,works.detail)
router.post('/order/:id',orderValidator.create,orders.create)
router.get('/order/:id',orderValidator.details,orders.details)
router.get('/user/companyDetails',users.companyDetails)
router.post('/user/editprofile/changePassword',profileEdit,usersValidator.changePassword,users.changePassword)
router.post('/user/editProfile/changeName',profileEdit,usersValidator.changeName,users.changeName)
router.post('/user/editProfile/changeMobile',profileEdit,usersValidator.changeMobile,users.changeMobile)
router.post('/user/editProfile/changeMobileConfirm',profileEdit,usersValidator.confirmMobileChange,users.confirmMobileChange)
router.post('/user/editProfile/changeCompanyDetails',profileEdit,usersValidator.changeCompanyDetails,users.changeCompanyDetails)
router.post('/user/sendOtp/:token',usersValidator.confirmOtp,users.confirmOtp)
router.post('/works/search',workValidator.searchAll,works.searchAll)
router.post('/supplier/bids/create/:orderId',supplierCheck,bids.deleteOldBids,bidValidator.create,bids.create)
router.post('/supplier/bids',supplierCheck,bidValidator.list,bids.list)
router.post('/supplier/bids/remove/:bidId',supplierCheck,bidValidator.remove,bids.remove)
router.post('/supplier/bid/orders',supplierCheck,orderValidator.getBidOrders,orders.getBidOrders)

/* PENDING */
/*router.post('/user/:id/work',authUser,options.findOption,users.addWork)*/

/* PENDING */
router.post('/user/work/details',users.workAll)
router.post('/user/orders',orderValidator.userAll,orders.userAll)

module.exports = router // Called in index file