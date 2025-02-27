const mongoose = require('mongoose');

// Define the schema for Section
const sectionSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Tenant', // Reference to Tenant model
        index: true // Improves query performance
    },
    name: {
        type: String,
        required: true
    }
});

// Ensure section names are unique per tenant
sectionSchema.index({ name: 1, tenantId: 1 }, { unique: true });

// Create and export the Section model
module.exports = mongoose.model('Section', sectionSchema);
