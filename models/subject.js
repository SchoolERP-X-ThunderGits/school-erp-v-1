const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for the Subject model
const subjectSchema = new Schema({
    tenantId: {
        type: Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true // Improves performance for queries scoped to a tenant
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Ensure subject names are unique within the same tenant
subjectSchema.index({ name: 1, tenantId: 1 }, { unique: true });

// Create and export the Subject model
module.exports = mongoose.model('Subject', subjectSchema);
