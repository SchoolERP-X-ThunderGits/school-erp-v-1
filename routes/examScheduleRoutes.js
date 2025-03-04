const express = require('express');
const router = express.Router();
const ExamSchedule = require('../models/examSchedule');
const Subject = require('../models/subject');
const ExamName = require('../models/examName');
const Class = require('../models/class');
const authMiddleware = require("../middleware/auth.js");

// Create a new exam schedule
router.post('/',authMiddleware(), async (req, res) => {
    const { examNameId, subjectId, classId, date, startTime, endTime } = req.body;
    const tenantId = req.user.tenantId; // Assuming tenantId is set on req.user by some middleware

    try {
        // Validate references
        const examName = await ExamName.findOne({ _id: examNameId, tenantId });
        const subject = await Subject.findOne({ _id: subjectId, tenantId });
        const classDoc = await Class.findOne({ _id: classId, tenantId });

        if (!examName || !subject || !classDoc) {
            return res.status(400).json({ error: 'Invalid exam name, subject, or class' });
        }

        // Create the new exam schedule
        const examSchedule = new ExamSchedule({
            tenantId,
            examName: examName._id,
            subject: subject._id,
            class: classDoc._id,
            date,
            startTime,
            endTime
        });

        await examSchedule.save();
        res.status(201).json(examSchedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all exam schedules for the tenant
router.get('/',authMiddleware(), async (req, res) => {
    const tenantId = req.user.tenantId;
    try {
        const schedules = await ExamSchedule.find({ tenantId })
            .populate('examName subject class')
            .exec();
        res.status(200).json(schedules);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a single exam schedule by ID, scoped to tenant
router.get('/:id',authMiddleware(), async (req, res) => {
    const tenantId = req.user.tenantId;
    try {
        const examSchedule = await ExamSchedule.findOne({ _id: req.params.id, tenantId })
            .populate('examName subject class')
            .exec();

        if (!examSchedule) {
            return res.status(404).json({ error: 'Exam schedule not found' });
        }
        res.status(200).json(examSchedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update an exam schedule by ID, scoped to tenant
router.put('/:id',authMiddleware(), async (req, res) => {
    const { examNameId, subjectId, classId, date, startTime, endTime } = req.body;
    const tenantId = req.user.tenantId;

    try {
        // Validate references
        const examName = await ExamName.findOne({ _id: examNameId, tenantId });
        const subject = await Subject.findOne({ _id: subjectId, tenantId });
        const classDoc = await Class.findOne({ _id: classId, tenantId });

        if (!examName || !subject || !classDoc) {
            return res.status(400).json({ error: 'Invalid exam name, subject, or class' });
        }

        // Update the exam schedule
        const updatedSchedule = await ExamSchedule.findOneAndUpdate(
            { _id: req.params.id, tenantId },
            { examName: examName._id, subject: subject._id, class: classDoc._id, date, startTime, endTime },
            { new: true }
        ).populate('examName subject class').exec();

        if (!updatedSchedule) {
            return res.status(404).json({ error: 'Exam schedule not found' });
        }

        res.status(200).json(updatedSchedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an exam schedule by ID, scoped to tenant
router.delete('/:id',authMiddleware(), async (req, res) => {
    const tenantId = req.user.tenantId;
    try {
        const examSchedule = await ExamSchedule.findOneAndDelete({ _id: req.params.id, tenantId });

        if (!examSchedule) {
            return res.status(404).json({ error: 'Exam schedule not found' });
        }

        res.status(200).json({ message: 'Exam schedule deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
