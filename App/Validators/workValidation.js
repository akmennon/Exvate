const {body,param} = require('express-validator')

module.exports.detail = [
    param('id','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
]

module.exports.searchAll = [
    body('query','Invalid Attempt').exists({checkFalsy:true,checkNull:true}).isString().trim().isLength({min:2}),
    body('autoSearch','Invalid Attempt').optional().isBoolean(),
    body('pageCount','Invalid Attempt').optional().exists({checkFalsy:true,checkNull:true}).isInt({ min: 1, max: 99 })
]