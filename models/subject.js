const mongoose = require('mongoose');

// Define the schema for the Subject model
const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

// Create and export the Subject model
module.exports = mongoose.model('Subject', subjectSchema);
