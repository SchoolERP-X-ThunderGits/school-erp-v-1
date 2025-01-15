const express = require('express');
const router = express.Router();
const ExamSchedule = require('../models/examSchedule');
const Subject = require('../models/subject');
const ExamName = require('../models/examName');
const Class = require('../models/class');


// Create a new exam schedule
router.post('/', async (req, res) => {
    try {
        const { examNameId, subjectId, classId, date, startTime, endTime } = req.body;

        // Validate references
        const examName = await ExamName.findById(examNameId);
        const subject = await Subject.findById(subjectId);
        const classDoc = await Class.findById(classId);

        if (!examName || !subject || !classDoc) {
            return res.status(400).json({ error: 'Invalid exam name, subject, or class' });
        }

        // Create the new exam schedule
        const examSchedule = new ExamSchedule({
            examName: examName._id,
            subject: subject._id,
            class: classDoc._id,
            date,        // Added date field
            startTime,
            endTime
        });

        await examSchedule.save();
        res.status(201).json(examSchedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});



// Get all exam schedules
router.get('/', async (req, res) => {
    try {
        const schedules = await ExamSchedule.find()
            .populate('examName subject class')
            .exec();
        res.status(200).json(schedules);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Get a single exam schedule by ID
router.get('/:id', async (req, res) => {
    try {
        const examSchedule = await ExamSchedule.findById(req.params.id)
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



// Update an exam schedule by ID
// Update an exam schedule by ID
router.put('/:id', async (req, res) => {
    try {
        const { examNameId, subjectId, classId, date, startTime, endTime } = req.body;

        // Validate references
        const examName = await ExamName.findById(examNameId);
        const subject = await Subject.findById(subjectId);
        const classDoc = await Class.findById(classId);

        if (!examName || !subject || !classDoc) {
            return res.status(400).json({ error: 'Invalid exam name, subject, or class' });
        }

        // Update the exam schedule
        const updatedSchedule = await ExamSchedule.findByIdAndUpdate(
            req.params.id,
            { examName: examName._id, subject: subject._id, class: classDoc._id, date, startTime, endTime },
            { new: true }
        ).populate('examName subject class')
            .exec();

        if (!updatedSchedule) {
            return res.status(404).json({ error: 'Exam schedule not found' });
        }

        res.status(200).json(updatedSchedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Delete an exam schedule by ID
// Delete an exam schedule by ID
router.delete('/:id', async (req, res) => {
    try {
        const examSchedule = await ExamSchedule.findByIdAndDelete(req.params.id);

        if (!examSchedule) {
            return res.status(404).json({ error: 'Exam schedule not found' });
        }

        res.status(200).json({ message: 'Exam schedule deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// Get exam schedule by class and exam name
// Get exam schedule by class and exam name



module.exports = router;
