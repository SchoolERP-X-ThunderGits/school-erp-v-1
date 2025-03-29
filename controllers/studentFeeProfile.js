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
    const { classId, section, dueDate } = req.params;
    const tenantId = req.user.tenantId;
    const cutoffDate = moment(dueDate).endOf('day');

    try {
        let query = { class_Id: classId, tenantId };
        if (section) {
            query.section = section;
        }

        const students = await Student.find(query).populate('class_Id');
        const studentDetails = await Promise.all(students.map(async (student) => {
            const feeProfile = await StudentFeeProfile.findOne({ studentId: student._id })
                .populate({
                    path: "feeStructures",
                    populate: { path: "feeGroups" }
                })
                .populate('payments');

            if (!feeProfile) return null;

            const paidFeeTypes = new Set();
            feeProfile.payments.forEach(payment => {
                payment.feePaid.forEach(fee => paidFeeTypes.add(fee.feeType));
            });

            let dueFees = [];

            feeProfile.feeStructures.forEach(feeStructure => {
                feeStructure.feeGroups.forEach(feeGroup => {
                    if (!paidFeeTypes.has(feeGroup.feeType) && moment(feeGroup.dueDate).isBefore(cutoffDate)) {
                        dueFees.push({
                            feeType: feeGroup.feeType,
                            amountDue: feeGroup.amount,
                            dueDate: feeGroup.dueDate
                        });
                    }
                });
            });

            console.log(student);

            return {
                studentId: student._id,
                studentDetails: student,
                dueFees
            };
        }));

        const filteredStudentDetails = studentDetails.filter(details => details !== null);
        res.status(200).json(filteredStudentDetails);
    } catch (error) {
        console.error('Error fetching students by class or section with date:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getStudentsFeesByClassOrSection = async (req, res) => {
    const { classId, section, dueDate } = req.params;
    const tenantId = req.user.tenantId;
    const cutoffDate = moment(dueDate).endOf('day');

    try {
        let query = { class_Id: classId, tenantId };
        if (section) {
            query.section = section;
        }

        const students = await Student.find(query).populate('class_Id');
        const studentDetails = await Promise.all(students.map(async (student) => {
            const feeProfile = await StudentFeeProfile.findOne({ studentId: student._id })
                .populate({
                    path: "feeStructures",
                    populate: { path: "feeGroups" }
                })
                .populate('payments');

            if (!feeProfile) return null;

            const paidFeeTypes = new Set();
            feeProfile.payments.forEach(payment => {
                payment.feePaid.forEach(fee => paidFeeTypes.add(fee.feeType));
            });

            let dueFees = [];

            feeProfile.feeStructures.forEach(feeStructure => {
                feeStructure.feeGroups.forEach(feeGroup => {
                    if (!paidFeeTypes.has(feeGroup.feeType) && moment(feeGroup.dueDate).isBefore(cutoffDate)) {
                        dueFees.push({
                            feeType: feeGroup.feeType,
                            amountDue: feeGroup.amount,
                            dueDate: feeGroup.dueDate
                        });
                    }
                });
            });

            console.log(student);

            return {
                studentId: student._id,
                studentDetails: student,
                dueFees
            };
        }));

        const filteredStudentDetails = studentDetails.filter(details => details !== null);
        res.status(200).json(filteredStudentDetails);
    } catch (error) {
        console.error('Error fetching students by class or section with date:', error);
        res.status(500).json({ message: 'Server error' });
    }
};





