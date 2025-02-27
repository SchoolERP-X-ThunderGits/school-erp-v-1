const mongoose = require('mongoose');

// Define the schema for the Tenant model
const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    subdomain: {
        type: String,
        required: true,
        unique: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin' // Reference to the admin user
    },
    plan: {
        type: String,
        enum: ["free", "basic", "premium"],
        default: "free"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // School-Specific Details
    logo: {
        type: String, // Store URL or base64-encoded image
        default: null
    },
    contactNumber: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default: null
    },
    address: {
        type: String,
        default: null
    },
    website: {
        type: String,
        default: null
    },
    qrCodeUrl: {
        type: String, // Store URL of the QR image
        default: null
    },
    // Theme & Customization Settings
    themeSettings: {
        primaryColor: { type: String, default: "#000000" }, // Default black
        secondaryColor: { type: String, default: "#ffffff" }, // Default white
        font: { type: String, default: "Arial" }
    }
}, { timestamps: true }); // Adds createdAt & updatedAt fields automatically

// Create and export the Tenant model
module.exports = mongoose.model('Tenant', tenantSchema);
