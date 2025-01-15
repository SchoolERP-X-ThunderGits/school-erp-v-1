const mongoose = require('mongoose');

// Import the Subject and Class models
const Subject = require('./subject');  // Assuming Subject model is in the same directory
const Class = require('./class');  // Assuming Class model is in the same directory

// Define the schema for the Subject-Class Mapping model
const subjectClassMappingSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',  // Reference to the Class model
        required: true
    },
    subjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',  // Reference to the Subject model
        required: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create and export the SubjectClassMapping model
module.exports = mongoose.model('SubjectClassMapping', subjectClassMappingSchema);
