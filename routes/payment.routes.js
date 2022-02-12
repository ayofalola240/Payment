const express = require('express')
const billers = require('../Interswitch/BillerResource')
const pay = require('../controller/payment.controllers')

const router = express.Router()

router.get('/billers', billers.getBillers)
router.get('/billers_category/:categoryId', billers.getBillersByCategory)
router.get('/billers_payment_item/:billerId', billers.getBillerPaymentItems)
router.post('/bill_payment_advice', billers.sendBillPaymentAdvice)

module.exports = router;