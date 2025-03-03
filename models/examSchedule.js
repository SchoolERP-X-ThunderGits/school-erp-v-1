const mongoose = require('mongoose');

// Define the schema for ExamSchedule
const examScheduleSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
        index: true // Improves performance for queries scoped to a tenant
    },
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
        type: String, // Consider using ISO 8601 string or converting to Date type if needed for better time handling
        required: true
    },
    endTime: {
        type: String, // Consider using ISO 8601 string or converting to Date type if needed for better time handling
        required: true
    }
}, { timestamps: true });

// Optional: Create a compound index to ensure unique exam schedules per class, exam, and date
examScheduleSchema.index({ class: 1, examName: 1, date: 1, tenantId: 1 }, { unique: true });

// Create and export the ExamSchedule model
module.exports = mongoose.model('ExamSchedule', examScheduleSchema);
