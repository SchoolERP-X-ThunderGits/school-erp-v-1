const mongoose = require('mongoose');

// Define the schema for Class
const classSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant', // Reference to Tenant model
    index: true // Ensures efficient tenant-based queries
  },
  name: {
    type: String,
    required: true
  },
  sections: [
    {
      type: String
    }
  ]
}, { timestamps: true });

// Ensure class names are unique per tenant
classSchema.index({ name: 1, tenantId: 1 }, { unique: true });

// Create and export the Class model
module.exports = mongoose.model('Class', classSchema);
