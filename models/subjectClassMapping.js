const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Import the Subject and Class models
const Subject = require('./subject');  // Assuming Subject model is in the same directory
const Class = require('./class');  // Assuming Class model is in the same directory

// Define the schema for the Subject-Class Mapping model
const subjectClassMappingSchema = new Schema({
    tenantId: {
        type: Schema.Types.ObjectId,
        ref: 'Tenant',  // Reference to the Tenant model
        required: true,
        index: true // Improves performance for queries scoped to a tenant
    },
    class: {
        type: Schema.Types.ObjectId,
        ref: 'Class',  // Reference to the Class model
        required: true
    },
    subjects: [{
        type: Schema.Types.ObjectId,
        ref: 'Subject',  // Reference to the Subject model
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

// Ensure class and subjects combinations are unique within the same tenant
subjectClassMappingSchema.index({ class: 1, subjects: 1, tenantId: 1 }, { unique: true });

// Create and export the SubjectClassMapping model
module.exports = mongoose.model('SubjectClassMapping', subjectClassMappingSchema);
