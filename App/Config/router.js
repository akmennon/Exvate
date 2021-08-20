const express = require('express')
const router = express.Router()

/*-------------------- Controllers --------------------*/

const users = require('../Controllers/userController')
const types = require('../Controllers/typeController')
const categories = require('../Controllers/categoryController')
const works = require('../Controllers/workController')
const orders = require('../Controllers/orderController')
const options = require('../Controllers/optionController')

/*-------------------- Middlewares --------------------*/

/* For user authentication */
const authUser = require('../Middlewares/authUser') //Doesn't allow admins as well

/* For admin authentication */
const admin = require('../Middlewares/authAdmin')

/* For admin level authorization */
const adminLevel = require('../Middlewares/adminLevel')
/* 
    0 - Highest level data and changing data of the level 1
    1 - Can manipulate data that can affect multiple users
    2 - Can manipulate data of a single user
    3 - Can only read data
*/

/*-------------------- Routes --------------------*/

router.post('/user/signup',users.create)
router.post('/user/login',users.login)
router.get('/user/account',authUser,users.account)
router.get('/user/logout',authUser,users.logout)
router.get('/user/logout',authUser,users.logoutAll)
router.post('/user/forgotPassword',users.forgotPassword)
router.post('/user/resendRegisterMail',users.resendRegisterMail)
router.get('/user/confirmSign/:token',users.confirmSignupEmail)
router.get('/user/forgotCheck',users.forgotCheck)
router.post('/user/confirmForgot/:token',users.confirmChangePassword)
router.get('/supplier/:id/workOrders',authUser,users.workOrders)
router.get('/supplier/orders/:orderId/cancel',authUser,users.supplierCancel)/* Add suspension if cancelled during active order */
router.get('/supplier/orders/:orderId/complete',authUser,orders.completeOrder)
router.post('/admin/login',users.adminLogin)
router.post('/admin/types',admin.authAdminSign,adminLevel(1),types.create)
router.get('/admin/types',admin.authAdminToken,types.all)
router.get('/admin/types/:id',admin.authAdminToken,types.details)
router.put('/admin/types/:id',admin.authAdminSign,adminLevel(0),types.edit)
router.post('/admin/categories',admin.authAdminToken,adminLevel(1),categories.create)
router.get('/admin/categories/:id',admin.authAdminToken,categories.details)
router.put('/admin/categories/:id',admin.authAdminToken,adminLevel(0),categories.edit)
router.get('/admin/categories',admin.authAdminToken,categories.all)
router.post('/admin/works',admin.authAdminToken,adminLevel(1),works.create)
router.get('/admin/works',admin.authAdminToken,works.all)
router.get('/admin/searchWorks',admin.authAdminToken,works.searchAll)
router.get('/admin/works/:id',admin.authAdminToken,works.detail)
router.put('/admin/works/:id',admin.authAdminToken,adminLevel(0),works.workEdit)
/* router.post('/admin/users',admin.authAdminToken,users.adminCreate) Temporarily not used */
router.get('/admin/users',admin.authAdminToken,users.all)
router.get('/admin/users/:id',admin.authAdminToken,users.details)
router.put('/admin/users/:id',admin.authAdminToken,users.userEdit)
router.post('/admin/user/:id/work',admin.authAdminToken,adminLevel(2),users.addWork)
router.get('/admin/users/:id/orders',admin.authAdminToken,orders.userAll)
router.post('/admin/users/:id/suspend',admin.authAdminSign,adminLevel(1),users.suspend)
router.post('/admin/users/:id/suspendCancel',admin.authAdminSign,adminLevel(1),users.suspendCancel)
router.post('/admin/users/:id/verifySupplier',admin.authAdminToken,adminLevel(1),users.supplierVerify)
router.get('/admin/orders',admin.authAdminToken,orders.all)
router.get('/admin/orders/:id',admin.authAdminToken,orders.details)
router.get('/admin/orders/:id/suppliers',admin.authAdminToken,users.suppliers)
router.post('/admin/orders/verify/:id',admin.authAdminToken,adminLevel(1),orders.verifyOrder)
router.post('/admin/orders/payment/:id',admin.authAdminSign,adminLevel(1),orders.paymentConfirm)
router.get('/admin/supplier/:id/workOrders',admin.authAdminToken,users.workOrders)/* not used */
router.post('/admin/orders/:id/orderfn',admin.authAdminSign,adminLevel(1),orders.orderFns)
router.post('/admin/orders/:id/refund',admin.authAdminSign,adminLevel(1),orders.refundOrder)
router.post('/admin/orders/:id/samples',admin.authAdminSign,adminLevel(1),orders.samples)
router.post('/admin/orders/supplierPayment/:id',admin.authAdminSign,adminLevel(1),orders.supplierPayment)
router.post('/admin/orders/:id/contractFinished',admin.authAdminSign,adminLevel(1),orders.contractFinished)
router.post('/admin/orders/:id/addCharges',admin.authAdminSign,adminLevel(1),orders.orderCharges)
router.post('/admin/orders/:id/removeCharges',admin.authAdminToken,adminLevel(1),orders.removeCharges)
router.get('/admin/token',users.adminToken)
router.post('/admin/logout',users.adminLogout)
router.get('/categories/all',categories.all)
router.get('/types/all',types.all)
router.get('/works/all',works.all)
router.get('/works/:id',works.detail)
router.post('/order',authUser,orders.create)
router.get('/order/:id',authUser,orders.details)

/* PENDING */
/*router.post('/user/:id/work',authUser,options.findOption,users.addWork)*/

/* PENDING */
router.post('/user/work/details',authUser,users.workAll)
router.post('/user/orders',authUser,orders.userAll)

module.exports = router // Called in index file