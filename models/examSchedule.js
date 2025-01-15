const mongoose = require('mongoose');

// Define the schema for ExamSchedule
const examScheduleSchema = new mongoose.Schema({
    examName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExamName',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Create and export the ExamSchedule model
module.exports = mongoose.model('ExamSchedule', examScheduleSchema);
