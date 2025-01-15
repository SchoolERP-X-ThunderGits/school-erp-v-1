const mongoose = require('mongoose');

// Define the schema for the ExamName model
const examNameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
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

// Create and export the ExamName model
module.exports = mongoose.model('ExamName', examNameSchema);
