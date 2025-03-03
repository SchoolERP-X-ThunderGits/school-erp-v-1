const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true // Improves performance for queries scoped to a tenant
    },
    razorpay_order_id: {
        type: String,
    },
    razorpay_payment_id: {
        type: String,
    },
    razorpay_signature: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    receipt_no: {
        type: String,
        required: true
    },
    feePaid: [{
        feeType: { type: String, required: true }, // Reference to the fee type
        amount: { type: Number, required: true }, // Amount of the fee
    }],
    paymentMethod: {
        type: String,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps




const Payment = mongoose.model('Payment', PaymentSchema);

module.exports = Payment;
