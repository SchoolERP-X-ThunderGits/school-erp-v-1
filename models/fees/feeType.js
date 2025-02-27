// Import Mongoose
const mongoose = require('mongoose');

// Define FeeType schema
const FeeTypeSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Tenant', // Reference to Tenant model
        index: true // Ensures efficient queries
    },
    name: {
        type: String,
        required: true
    }, // Name of the fee type (e.g., "Tuition Fee", "Transportation Fee")
    description: {
        type: String
    } // Description of the fee type
}, { timestamps: true });

// Ensure fee type names are unique per tenant
FeeTypeSchema.index({ name: 1, tenantId: 1 }, { unique: true });

// Export model
module.exports = mongoose.model('FeeType', FeeTypeSchema);
