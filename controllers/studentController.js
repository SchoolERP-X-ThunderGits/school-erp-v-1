const bcrypt = require('bcrypt');
const Student = require('../models/student.js');
const StudentFeeProfile = require("../models/fees/studentFeeProfile.js");

exports.addStudent = async (req, res) => {
    const tenantId = req.user.tenantId; // Extract tenant ID from the logged-in user

    const {
        admission_Number,
        roll_Number,
        first_Name,
        last_Name,
        date_Of_Birth,
        gender,
        permanent_Address,
        address_For_Correspondence,
        contact_Number,
        alternet_Contact_Number,
        email,
        nationality,
        religion,
        category,
        date_Of_Admission,
        blood_Group,
        father_Name,
        father_Occupation,
        mother_Name,
        mother_Occupation,
        student_Photo,
        aadhar_number,
        due_amount,
        class_Id,
        section,
        session,
        feeStructures,
        addressForId, 
    } = req.body;

    try {
        // Create a new student with tenantId
        const newStudent = new Student({
            tenantId,
            admission_Number,
            roll_Number,
            first_Name,
            last_Name,
            date_Of_Birth,
            gender,
            permanent_Address,
            address_For_Correspondence,
            contact_Number,
            alternet_Contact_Number,
            email,
            nationality,
            religion,
            category,
            date_Of_Admission,
            blood_Group,
            father_Name,
            father_Occupation,
            mother_Name,
            mother_Occupation,
            student_Photo,
            aadhar_number,
            due_amount,
            class_Id,
            section,
            session,
            addressForId, 
        });

        const savedStudent = await newStudent.save();

        // Create a fee profile for the student and associate fee structures
        const newFeeProfile = new StudentFeeProfile({
            studentId: savedStudent._id,
            tenantId, // Ensure fee profiles are scoped to the tenant
            feeStructures,
            payments: []
        });
        await newFeeProfile.save();

        res.status(201).json({
            message: 'Student created successfully',
            result: savedStudent
        });
    } catch (error) {
        console.error('Error adding student:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudents = async (req, res) => {
    try {
        const tenantId = req.user.tenantId;
        
        // Fetch all students within the tenant
        const students = await Student.find({ tenantId }).populate('class_Id');
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentById = async (req, res) => {
    const studentId = req.params.id;
    try {
        const tenantId = req.user.tenantId;

        // Fetch student by ID and tenantId
        const student = await Student.findOne({ _id: studentId, tenantId }).populate('class_Id');
        if (!student) {
            return res.status(404).json({ message: 'Student not found or access denied' });
        }
        res.status(200).json(student);
    } catch (error) {
        console.error('Error fetching student by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateStudent = async (req, res) => {
    const studentId = req.params.id;
    const updateFields = req.body;
    const tenantId = req.user.tenantId;

    try {
        // Find student within the tenant
        let student = await Student.findOne({ _id: studentId, tenantId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found or access denied' });
        }

        // Update student fields
        Object.keys(updateFields).forEach(key => {
            student[key] = updateFields[key];
        });

        const updatedStudent = await student.save();

        // Update fee profile if needed
        if (updateFields.feeStructures) {
            const studentFeeProfile = await StudentFeeProfile.findOne({ studentId, tenantId });
            if (studentFeeProfile) {
                studentFeeProfile.feeStructures = updateFields.feeStructures;
                await studentFeeProfile.save();
            }
        }

        res.status(200).json({ message: 'Student updated successfully', result: updatedStudent });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteStudent = async (req, res) => {
    const studentId = req.params.id;
    const tenantId = req.user.tenantId;

    try {
        const student = await Student.findOne({ _id: studentId, tenantId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found or access denied' });
        }

        await student.deleteOne();
        res.status(200).json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentsByClass = async (req, res) => {
    const tenantId = req.user.tenantId;
    const classId = req.params.classId;
    
    try {
        const students = await Student.find({ class_Id: classId, tenantId });
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students by class:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentsByClassAndSection = async (req, res) => {
    const { classId, section } = req.params;
    const tenantId = req.user.tenantId;

    try {
        const students = await Student.find({ class_Id: classId, section, tenantId });
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students by class and section:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentsByQuery = async (req, res) => {
    const query = req.query;
    const tenantId = req.user.tenantId;

    try {
        const students = await Student.find({ ...query, tenantId }).populate('class_Id');
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students by query:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getStudentsByClassOrSection = async (req, res) => {
    const { classId, section } = req.params;
    const tenantId = req.user.tenantId;
    try {
        let query = { class_Id: classId, tenantId };

        // Check if section is provided
        if (section) {
            query.section = section;
        }

        // Fetch students based on the constructed query
        const students = await Student.find(query).populate('class_Id');

        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students by class or section:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getLastGeneratedAdmissionNumber = async (req, res) => {
    const tenantId = req.user.tenantId;

    try {
        const lastStudent = await Student.findOne({ tenantId }).sort({ admission_Number: -1 });

        if (!lastStudent) {
            return res.status(200).json({ lastGeneratedAdmissionNumber: "AD-1000" });
        }

        const numericPart = parseInt(lastStudent.admission_Number.split("-")[1]);
        const nextAdmissionNumber = `AD-${numericPart + 1}`;

        res.status(200).json({ lastGeneratedAdmissionNumber: nextAdmissionNumber });
    } catch (error) {
        console.error('Error fetching last generated admission number:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
