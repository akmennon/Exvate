const {body,param} = require('express-validator')

module.exports.create = [
    param('orderId','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).trim().isMongoId(),
    body('price','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).isInt({ min: 1 })
]

module.exports.list = [
    body('skip','Invalid Attempt').optional().isInt({ min: 1, max: 99 }),
    body('limit','Invalid Attempt').optional().isInt({ min: 1, max: 20 })
]

module.exports.remove = [
    param('bidId','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).trim().isMongoId()
]