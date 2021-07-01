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
const authUser = require('../Middlewares/authUser')

/* For admin authentication */
const admin = require('../Middlewares/authAdmin')

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
router.get('/user/workOrders/:id',authUser,users.workOrders)
router.get('/host/orders/:orderId/cancel',authUser,users.hostCancel)/* Add suspension if cancelled during active order */
router.get('/host/orders/:orderId/complete',authUser,orders.completeOrder)
router.post('/admin/login',users.adminLogin)
router.post('/admin/types',admin.authAdminSign,types.create)
router.get('/admin/types',admin.authAdminToken,types.all)
router.get('/admin/types/:id',admin.authAdminToken,types.details)
router.put('/admin/types/:id',admin.authAdminSign,types.edit)
router.post('/admin/categories',admin.authAdminToken,categories.create)
router.get('/admin/categories/:id',admin.authAdminToken,categories.details)
router.put('/admin/categories/:id',admin.authAdminToken,categories.edit)
router.get('/admin/categories',admin.authAdminToken,categories.all)
router.post('/admin/works',admin.authAdminToken,works.create)
router.get('/admin/works',admin.authAdminToken,works.all)
router.get('/admin/searchWorks',admin.authAdminToken,works.searchAll)
router.get('/admin/works/:id',admin.authAdminToken,works.detail)
router.put('/admin/works/:id',admin.authAdminToken,works.workEdit)
/* router.post('/admin/users',admin.authAdminToken,users.adminCreate) Temporarily not used */
router.get('/admin/users',admin.authAdminToken,users.all)
router.get('/admin/users/:id',admin.authAdminToken,users.details)
router.put('/admin/users/:id',admin.authAdminToken,users.userEdit)
router.post('/admin/user/:id/work',admin.authAdminToken,users.addWork)
router.get('/admin/users/:id/orders',admin.authAdminToken,orders.userAll)
router.get('/admin/orders',admin.authAdminToken,orders.all)
router.get('/admin/orders/:id',admin.authAdminToken,orders.details)
router.get('/admin/orders/:id/suppliers',admin.authAdminToken,users.suppliers)
router.post('/admin/orders/verify/:id',admin.authAdminToken,orders.verifyOrder)
router.post('/admin/orders/payment/:id',admin.authAdminSign,orders.paymentConfirm)
router.get('/admin/workOrders/:id',admin.authAdminToken,users.workOrders)/* not used */
router.post('/admin/orders/:id/orderfn',admin.authAdminSign,orders.orderFns)
router.post('/admin/orders/:id/refund',admin.authAdminSign,orders.refundOrder)
router.post('/admin/orders/:id/samples',admin.authAdminSign,orders.samples)
router.post('/admin/orders/hostPayment/:id',admin.authAdminSign,orders.hostPayment)
router.post('/admin/orders/:id/contractFinished',admin.authAdminSign,orders.contractFinished)
router.get('/admin/token',users.adminToken)
router.post('/admin/logout',users.adminLogout)
router.get('/categories/all',categories.all)
router.get('/types/all',types.all)
router.get('/works/all',works.all)
router.get('/works/:id',works.detail)
router.post('/order',authUser,orders.create)
router.get('/order/:id',authUser,orders.details)
router.get('/order/confirm/:id',authUser,orders.confirm)

/* PENDING */
/*router.post('/user/:id/work',authUser,options.findOption,users.addWork)*/

/* PENDING */
router.post('/user/work/details',authUser,users.workAll)
router.post('/user/orders',authUser,orders.userAll)

module.exports = router // Called in index file