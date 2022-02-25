const {body} = require('express-validator')

module.exports.all = [
    body('skip','Invalid Attempt').optional().isInt({ min: 1, max: 99 }),
    body('limit','Invalid Attempt').optional().isInt({ min: 1, max: 99 })
]