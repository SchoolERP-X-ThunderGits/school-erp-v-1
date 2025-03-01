const mongoose = require('mongoose');

// Define the schema for Student
const studentSchema = new mongoose.Schema({
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Tenant', // Reference to Tenant model
    index: true // Improves query performance
  },
  admission_Number: {
    type: String,
    required: true
  },
  roll_Number: {
    type: Number,
    required: true
  },
  first_Name: {
    type: String,
    required: true
  },
  last_Name: {
    type: String,
    required: true
  },
  class_Id: {
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
  date_Of_Birth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  permanent_Address: {
    type: String,
    required: true
  },
  address_For_Correspondence: {
    type: String
  },
  contact_Number: {
    type: String,
    required: true
  },
  alternet_Contact_Number: {
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
  date_Of_Admission: {
    type: Date,
    required: true
  },
  blood_Group: {
    type: String
  },
  father_Name: {
    type: String,
    required: true
  },
  father_Occupation: {
    type: String
  },
  mother_Name: {
    type: String,
    required: true
  },
  mother_Occupation: {
    type: String
  },
  student_Photo: {
    type: String, // Assuming URL or base64-encoded image
    required: true
  },
  aadhar_number: {
    type: String
  },
  due_amount: {
    type: Number
  }
}, { timestamps: true });

// Create and export the Student model
module.exports = mongoose.model('Student', studentSchema);
