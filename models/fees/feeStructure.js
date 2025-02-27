// Import Mongoose
const mongoose = require('mongoose');

// Define FeeStructure schema
const FeeStructureSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Tenant', // Reference to Tenant model
        index: true // Improves query performance
    },
    name: {
        type: String,
        required: true
    }, // Name of the fee structure
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }, // Reference to the class associated with the fee structure
    feeGroups: [
        {
            feeType: { type: String, required: true }, // Fee type
            amount: { type: Number, required: true }, // Amount of the fee
            dueDate: { type: Date, required: true } // Due date of the fee
        }
    ]
}, { timestamps: true });

// Ensure fee structure names are unique per tenant
FeeStructureSchema.index({ name: 1, tenantId: 1 }, { unique: true });

// Export model
const FeeStructure = mongoose.model('FeeStructure', FeeStructureSchema);

module.exports = FeeStructure;
