// models/Admin.js

const mongoose = require('mongoose');

// Define the schema for the Admin model
const adminSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Tenant', // Reference to Tenant model
        index: true // Ensures efficient queries
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    fullName: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        default: "admin",
        enum: ["admin", "moderator"]
    }
});

// Create and export the Admin model
module.exports = mongoose.model('Admin', adminSchema);
