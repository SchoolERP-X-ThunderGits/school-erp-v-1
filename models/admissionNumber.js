const mongoose = require('mongoose');
const admissionNumberSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        unique: true,
        required: true
    },
    prefix: {
        type: String,
        required: true
    },
    currentNumber: {
        type: Number,
        default: 0 // Start from 0, the first student will increment it to 1
    }
});

module.exports = mongoose.model('AdmissionNumber', admissionNumberSchema);
