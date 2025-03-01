const express = require('express');
const {
    getStudentFeeProfile,
    updateStudentFeeProfile,
    getStudentsByClassOrSection
} = require("../controllers/studentFeeProfile.js");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

// Get student's fee profile by student ID
router.get('/feeProfile/:studentId', authMiddleware(), getStudentFeeProfile);

// Update student's fee profile by student ID
router.put('/feeProfile/:studentId', authMiddleware(), updateStudentFeeProfile);

router.get('/fees/byClassOrSection/:classId/:section?', authMiddleware(["admin", "moderator"]), getStudentsByClassOrSection);

module.exports = router;
