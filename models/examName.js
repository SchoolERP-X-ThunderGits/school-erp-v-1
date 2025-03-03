const mongoose = require('mongoose');

// Define the schema for the ExamName model
const examNameSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Tenant', // Reference to the Tenant model
        index: true // Improves performance for queries scoped to a tenant
    },
    name: {
        type: String,
        required: true
    },
    session: {
        type: String,  // Example: "2024 Spring", "2024 Fall"
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Ensure exam names are unique within the same tenant


// Create and export the ExamName model
module.exports = mongoose.model('ExamName', examNameSchema);
