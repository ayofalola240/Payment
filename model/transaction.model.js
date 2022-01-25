const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
    {   booking:{
            type: mongoose.Schema.ObjectId,
            ref: 'Booking'
        },
        customer:Object,
        action:String,
        status: String,
        trx_id: String,
        trx_ref: {
            type: String,
            unique: true
        },
        currency: String,
        amount: Number,
        fees: String,
        paidAt:Date 
    }

)

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
