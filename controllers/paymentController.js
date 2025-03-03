// controllers/paymentController.js
const crypto = require('crypto');
require('dotenv').config();
const Payment = require("../models/payment");
const StudentFeeProfile = require("../models/fees/studentFeeProfile");

// Removed Razorpay example for simplicity. It can be reintroduced following a similar pattern to below adjustments.

const handleError = (res, error, message = 'Internal Server Error', statusCode = 500) => {
    console.error(error);
    res.status(statusCode).json({ message });
};

// Assuming tenantId is available on req.user, set by some authentication middleware
const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, studentId, receipt_no, feePaid, paymentMethod, amountPaid } = req.body;
    const tenantId = req.user.tenantId;

    try {
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(sign.toString())
            .digest("hex");

        const isAuthentic = expectedSign === razorpay_signature;

        if (isAuthentic) {
            const payment = new Payment({
                tenantId,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                studentId,
                receipt_no,
                feePaid,
                paymentMethod,
                amountPaid
            });

            const savedPayment = await payment.save();

            await StudentFeeProfile.findOneAndUpdate(
                { studentId: studentId, tenantId: tenantId },
                { $push: { payments: savedPayment._id } },
                { new: true }
            );

            res.json({
                success: true,
                message: "Payment Successfully Verified",
                payment: savedPayment
            });
        } else {
            res.status(400).json({ message: "Invalid Signature" });
        }
    } catch (error) {
        handleError(res, error);
    }
};

const getPaymentById = async (req, res) => {
    const tenantId = req.user.tenantId;
    try {
        const payment = await Payment.findOne({ _id: req.params.id, tenantId }).populate('studentId');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json(payment);
    } catch (error) {
        handleError(res, error);
    }
};

const getPaymentByReceiptNumber = async (req, res) => {
    const tenantId = req.user.tenantId;
    try {
        const payment = await Payment.findOne({ receipt_no: req.params.receipt_no, tenantId }).populate('studentId');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.json(payment);
    } catch (error) {
        handleError(res, error);
    }
};

const getAllPayments = async (req, res) => {
    const tenantId = req.user.tenantId;
    try {
        const payments = await Payment.find({ tenantId });
        res.json(payments);
    } catch (error) {
        handleError(res, error);
    }
};

const createOfflinePayment = async (req, res) => {
    const { studentId, receipt_no, feePaid, paymentMethod, amountPaid } = req.body;
    const tenantId = req.user.tenantId;
    const generatedReceiptNo = receipt_no || generateReceiptNo();

    // Validate input fields
    const requiredFields = ['studentId', 'feePaid', 'paymentMethod', 'amountPaid'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
        return res.status(400).json({ message: `Missing required fields: ${missingFields.join(', ')}` });
    }

    if (!Array.isArray(feePaid) || feePaid.some(fee => typeof fee.feeType !== 'string' || typeof fee.amount !== 'number')) {
        return res.status(400).json({ message: 'feePaid must be an array of objects with feeType as string and amount as number' });
    }

    if (typeof amountPaid !== 'number') {
        return res.status(400).json({ message: 'amountPaid must be a number' });
    }

    try {
        const payment = new Payment({
            tenantId,
            studentId,
            receipt_no: generatedReceiptNo,
            feePaid,
            paymentMethod,
            amountPaid
        });

        const savedPayment = await payment.save();

        await StudentFeeProfile.findOneAndUpdate(
            { studentId: studentId, tenantId: tenantId },
            { $push: { payments: savedPayment._id } },
            { new: true }
        );

        res.json({
            success: true,
            message: "Offline Payment Successfully Recorded",
            payment: savedPayment
        });
    } catch (error) {
        handleError(res, error);
    }
};

module.exports = {
    verifyPayment,
    getPaymentById,
    getPaymentByReceiptNumber,
    getAllPayments,
    createOfflinePayment
};
