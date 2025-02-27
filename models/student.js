const mongoose = require('mongoose');

// Define the schema for Student
const studentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant', // Reference to Tenant model
    index: true // Improves query performance
  },
  admissionNumber: {
    type: String,
    required: true
  },
  rollNumber: {
    type: Number,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class', // Reference to Class model
    required: true
  },
  section: {
    type: String
  },
  session: {
    type: String, // Change to Date if required
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  permanentAddress: {
    type: String,
    required: true
  },
  addressForCorrespondence: {
    type: String
  },
  contactNumber: {
    type: String,
    required: true
  },
  alternateContactNumber: {
    type: String
  },
  email: {
    type: String
  },
  nationality: {
    type: String,
    required: true
  },
  religion: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  dateOfAdmission: {
    type: Date,
    required: true
  },
  bloodGroup: {
    type: String
  },
  fatherName: {
    type: String,
    required: true
  },
  fatherOccupation: {
    type: String
  },
  motherName: {
    type: String,
    required: true
  },
  motherOccupation: {
    type: String
  },
  studentPhoto: {
    type: String, // Assuming URL or base64-encoded image
    required: true
  },
  aadharNumber: {
    type: String
  },
  dueAmount: {
    type: Number
  }
}, { timestamps: true });

// Create and export the Student model
module.exports = mongoose.model('Student', studentSchema);
