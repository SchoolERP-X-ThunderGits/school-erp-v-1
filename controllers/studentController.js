const bcrypt = require('bcrypt');
const Student = require('../models/student.js');
const csv = require('csv-parse');
const { parse } = require('xlsx');
const StudentFeeProfile = require("../models/fees/studentFeeProfile.js");
const AdmissionNumber = require('../models/admissionNumber.js');

exports.addStudent = async (req, res) => {
    const tenantId = req.user.tenantId; // Extract tenant ID from the logged-in user

    const {

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
        address_for_id
    } = req.body;

    try {
        // Create a new student with tenantId
        // Retrieve the current admission number entry for the tenant
        const admissionNumberEntry = await AdmissionNumber.findOne({ tenantId });
        if (!admissionNumberEntry) {
            return res.status(404).json({ message: 'Admission number configuration not found' });
        }

        // Increment and format the new admission number
        admissionNumberEntry.currentNumber += 1;
        await admissionNumberEntry.save();

        const admissionNumber = `${admissionNumberEntry.prefix}-${admissionNumberEntry.currentNumber.toString().padStart(5, '0')}`;
        const newStudent = new Student({
            tenantId,
            admission_Number: admissionNumber,
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
            address_for_id,
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


        // Fetch student by ID and tenantId
        const student = await Student.findOne({ _id: studentId, }).populate('class_Id');
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

const parseFile = async (buffer, format) => {
    if (format === 'csv') {
        return new Promise((resolve, reject) => {
            csv.parse(buffer, { columns: true }, (error, data) => {
                if (error) reject(error);
                resolve(data);
            });
        });
    } else if (format === 'xlsx') {
        const workbook = parse(buffer, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        return parse.utils.sheet_to_json(worksheet);
    }
};

const processStudent = async (studentData, tenantId, classId, section) => {
    const admissionNumberEntry = await AdmissionNumber.findOne({ tenantId });
    if (!admissionNumberEntry) {
        throw new Error('Admission number configuration not found');
    }
    admissionNumberEntry.currentNumber += 1;
    await admissionNumberEntry.save();
    const admissionNumber = `${admissionNumberEntry.prefix}-${admissionNumberEntry.currentNumber.toString().padStart(5, '0')}`;

    const student = new Student({
        tenantId,
        class_Id: classId,
        section: section,
        admission_Number: admissionNumber,
        ...studentData,
        date_Of_Birth: new Date(studentData.date_Of_Birth),
        date_Of_Admission: new Date(studentData.date_Of_Admission),
    });
    const savedStudent = await student.save();

    const newFeeProfile = new StudentFeeProfile({
        studentId: savedStudent._id,
        tenantId,
        feeStructures: studentData.feeStructures ? JSON.parse(studentData.feeStructures) : [],
        payments: []
    });
    await newFeeProfile.save();

    return { admissionNumber: savedStudent.admission_Number, name: savedStudent.first_Name + ' ' + savedStudent.last_Name };
};
exports.bulkAddStudents = async (req, res, classId, section) => {
    try {
        const { file } = req;
        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        let format = file.mimetype.includes('csv') ? 'csv' : 'xlsx';
        const studentsData = await parseFile(file.buffer, format);
        
        // Get the admission number entry for the tenant **only once**
        const tenantId = req.user.tenantId;
        let admissionNumberEntry = await AdmissionNumber.findOne({ tenantId });
        
        if (!admissionNumberEntry) {
            return res.status(404).json({ message: 'Admission number configuration not found' });
        }

        let currentAdmissionNumber = admissionNumberEntry.currentNumber; // Get last used number

        const results = [];

        for (const studentData of studentsData) {
            currentAdmissionNumber++; // Increment for each student
            const admissionNumber = `${admissionNumberEntry.prefix}-${currentAdmissionNumber.toString().padStart(5, '0')}`;
            
            const savedStudent = await processStudent(studentData, tenantId, classId, section, admissionNumber);
            results.push(savedStudent);
        }

        // Update admission number in database **after processing all students**
        admissionNumberEntry.currentNumber = currentAdmissionNumber;
        await admissionNumberEntry.save();

        res.status(201).json({ message: 'Students uploaded and added successfully', results });
    } catch (error) {
        console.error('Error in bulk uploading students:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

