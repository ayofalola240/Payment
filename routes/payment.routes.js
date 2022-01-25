const express = require('express')
const paymentController = require('../controller/payment.controllers')

const router = express.Router()

router.post('/get_token', paymentController.getInterSwitchToken)

router.post('/etransact', paymentController.webhook)
module.exports = router;