const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/paymentController');
const authMiddleware = require("../middleware/auth.js");

// ROUTE 1: Create Order API
// router.post('/order', paymentController.createOrder);

// ROUTE 2: Verify Payment API
// router.post('/verify', paymentController.verifyPayment);

// ROUTE 3: Get Payment by ID
router.get('/get/:id',authMiddleware(), paymentController.getPaymentById);

// ROUTE 4: Get Payment by Receipt Number
router.get('/receipt/:receipt_no',authMiddleware(), paymentController.getPaymentByReceiptNumber);

// ROUTE 5: Get All Payments
router.get('/getAll',authMiddleware(), paymentController.getAllPayments);

router.post('/collect-fee',authMiddleware(), paymentController.createOfflinePayment);

module.exports = router;
