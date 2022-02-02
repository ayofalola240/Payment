const express = require('express')
const billers = require('../Interswitch/BillerResource')
const pay = require('../controller/payment.controllers')

const router = express.Router()

router.get('/get_billers', billers.getBillers)
router.get('/get_billers_category/:categoryId', billers.getBillersByCategory)
router.get('/get_billers_payment_item/:billerId', billers.getBillerPaymentItems)
router.post('/send_bill_payment_advice', billers.sendBillPaymentAdvice)

module.exports = router;