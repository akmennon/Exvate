const express = require('express')
const router = express.Router()

/*-------------------- Controllers --------------------*/

const users = require('../Controllers/userController')
const types = require('../Controllers/typeController')
const categories = require('../Controllers/categoryController')
const works = require('../Controllers/workController')
const orders = require('../Controllers/orderController')

/*-------------------- Middlewares --------------------*/

/* For user authentication */
const authUser = require('../Middlewares/authUser') //Doesn't allow admins as well

/* For profile edit verification */
const profileEdit = require('../Middlewares/profileEdit')

/*-------------------- Routes --------------------*/

router.post('/user/signup',users.create)
router.post('/user/login',users.login)
router.get('/user/account',authUser,users.account)
router.post('/user/profile',authUser,users.profile)
router.get('/user/logout',authUser,users.logout)
router.get('/user/logout',authUser,users.logoutAll)
router.post('/user/forgotPassword',users.forgotPassword)
router.post('/user/resendRegisterMail',users.resendRegisterMail)
router.post('/user/confirmSign/:token',users.confirmSignupEmail)
router.get('/user/forgotCheck',users.forgotCheck)
router.post('/user/confirmForgot/:token',users.confirmChangePassword)
router.post('/user/addAddress',authUser,users.addAddress)
router.post('/user/removeAddress/:id',authUser,users.removeAddress)
router.get('/supplier/:id/workOrders',authUser,users.workOrders)
router.get('/supplier/orders/:orderId/cancel',authUser,users.supplierCancel)/* Add suspension if cancelled during active order */
router.get('/categories/all',categories.all)
router.get('/types/all',types.all)
router.get('/works/all',works.all)
router.get('/works/:id',works.detail)
router.post('/order/:id',authUser,orders.create)
router.get('/order/:id',authUser,orders.details)
router.get('/user/companyDetails',authUser,users.companyDetails)
router.post('/user/editprofile/changePassword',authUser,profileEdit,users.changePassword)
router.post('/user/editProfile/changeName',authUser,profileEdit,users.changeName)
router.post('/user/editProfile/changeMobile',authUser,profileEdit,users.changeMobile)
router.post('/user/editProfile/changeMobileConfirm',authUser,profileEdit,users.confirmMobileChange)
router.post('/user/editProfile/changeCompanyDetails',authUser,profileEdit,users.changeCompanyDetails)
router.post('/user/sendOtp/:token',users.confirmOtp)

/* PENDING */
/*router.post('/user/:id/work',authUser,options.findOption,users.addWork)*/

/* PENDING */
router.post('/user/work/details',authUser,users.workAll)
router.post('/user/orders',authUser,orders.userAll)

module.exports = router // Called in index file