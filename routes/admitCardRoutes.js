const express = require('express');
const router = express.Router();
const ExamSchedule = require('../models/examSchedule');
const Subject = require('../models/subject');
const ExamName = require('../models/examName');
const Class = require('../models/class');

router.get('/by-class-and-exam', async (req, res) => {
    try {
        const { classId, examNameId } = req.query;
        console.log(classId,examNameId);
        

        // Validate class and exam name
        const classDoc = await Class.findById(classId);
        const examName = await ExamName.findById(examNameId);

        if (!classDoc) {
            return res.status(400).json({ error: 'Invalid class ID' });
        }

        if (!examName) {
            return res.status(400).json({ error: 'Invalid exam name ID' });
        }

        // Find exam schedules that match the class and exam name
        const schedules = await ExamSchedule.find({ class: classId, examName: examNameId })
            .populate('examName subject class')
            .exec();

        if (schedules.length === 0) {
            return res.status(404).json({ message: 'No exam schedules found for the specified class and exam name' });
        }

        res.status(200).json(schedules);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router