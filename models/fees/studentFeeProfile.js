// Import Mongoose
const mongoose = require('mongoose');

// Define StudentFeeProfile schema
const StudentFeeProfileSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Tenant', // Reference to Tenant model
        index: true // Improves query performance
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    feeStructures: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FeeStructure'
        }
    ],
    payments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment'
        }
    ]
}, { timestamps: true });

// Ensure tenant isolation for fee profiles
StudentFeeProfileSchema.index({ studentId: 1, tenantId: 1 }, { unique: true });

// Export model
module.exports = mongoose.model('StudentFeeProfile', StudentFeeProfileSchema);
