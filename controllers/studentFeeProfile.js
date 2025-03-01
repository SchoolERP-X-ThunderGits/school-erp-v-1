const StudentFeeProfile = require('../models/fees/studentFeeProfile.js');
const Payment = require('../models/payment.js');
const Student = require('../models/student.js');
const moment = require('moment');



exports.getStudentFeeProfile = async (req, res) => {
    
    const studentId = req.params.studentId;
    try {
        // Fetch student's fee profile by student ID and populate feeStructures and payments
        const feeProfile = await StudentFeeProfile.findOne({ studentId })
            .populate("feeStructures")
            .populate('payments');

        if (!feeProfile) {
            return res.status(404).json({ message: 'Fee profile not found' });
        }

        res.status(200).json(feeProfile);
    } catch (error) {
        console.error('Error fetching fee profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.updateStudentFeeProfile = async (req, res) => {
    const studentId = req.params.studentId;
    const { feeStructures, payments } = req.body;
    try {
        // Fetch student's fee profile by student ID
        let feeProfile = await StudentFeeProfile.findOne({ studentId });
        if (!feeProfile) {
            return res.status(404).json({ message: 'Fee profile not found' });
        }

        // Update fee profile fields
        feeProfile.feeStructures = feeStructures || feeProfile.feeStructures;
        feeProfile.payments = payments || feeProfile.payments;

        // Save updated fee profile
        await feeProfile.save();

        res.status(200).json({ message: 'Fee profile updated successfully', result: feeProfile });
    } catch (error) {
        console.error('Error updating fee profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};




exports.getStudentsByClassOrSection = async (req, res) => {
    const { classId, section } = req.params;
    const tenantId = req.user.tenantId;
    const today = moment().startOf('day');

    try {
        let query = { class_Id: classId, tenantId };
        if (section) {
            query.section = section;
        }

        const students = await Student.find(query).populate('class_Id');
        const studentDetails = await Promise.all(students.map(async (student) => {
            const feeProfile = await StudentFeeProfile.findOne({ studentId: student._id }).populate("feeStructures").populate('payments');
            if (!feeProfile) return null;

            

            const paidMonths = new Set();
            feeProfile.payments.forEach(payment => {
                payment.feePaid.forEach(fee => paidMonths.add(fee.feeType));
            });

            

            let dueMonths = [];
            let totalFeesOverdue = 0;

            feeProfile.feeStructures.forEach(feeStructure => {
                feeStructure.feeGroups.forEach(feeGroup => {
                
                    if (!paidMonths.has(feeGroup.feeType) && moment(feeGroup.dueDate).isBefore(today)) {
                        dueMonths.push(feeGroup.feeType);
                        totalFeesOverdue += feeGroup.amount;
                        
                    }
                });
            });

            return {
                studentId: student._id,
                studentDetails: {
                    admission_Number: student.admission_Number,
                    first_Name: student.first_Name,
                    last_Name: student.last_Name,
                    class: student.class_Id.className,
                    section: student.section
                },
                dueMonths,
                totalFeesOverdue
            };
        }));

        const filteredStudentDetails = studentDetails.filter(details => details !== null);
        res.status(200).json(filteredStudentDetails);
    } catch (error) {
        console.error('Error fetching students by class or section:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

