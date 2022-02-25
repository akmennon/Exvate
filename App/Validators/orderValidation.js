const {body,param,header} = require('express-validator')

module.exports.create = [
    param('id','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).trim().isMongoId(),
    body('resultId','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).trim().isMongoId(),
    body('orderData.address','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).trim().isMongoId(),
    body('orderData.result.time.values','Invalid Attempt').exists({checkFalsy:true,checkNull:true}),
    body('orderData.result.values','Invalid Attempt').exists({checkFalsy:true,checkNull:true}),
    body('orderData.result.workId','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).trim().isMongoId(),
    body('orderData.orderType','Invalid Attempt').optional().exists({checkFalsy:true,checkNull:true}).trim().equals('sample')
]

module.exports.details = [
    param('id','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).trim().isMongoId()
]

module.exports.userAll = [
    body('page','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).trim().isInt({min:1,max:99})
]

module.exports.workOrders = [
    param('id','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).trim().isMongoId(),
    header('page','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).trim().isInt({min:1,max:99})
]

module.exports.getBidOrders = [
    body('workId','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).trim().isMongoId(),
    body('skip','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).isInt({min:1}),
    body('limit','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).isInt({min:1,max:15})
]