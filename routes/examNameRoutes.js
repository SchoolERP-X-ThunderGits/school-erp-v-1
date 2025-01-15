const express = require('express');
const router = express.Router();
const ExamName = require('../models/examName');

// Create a new exam name
router.post('/', async (req, res) => {
    try {
        const { name, session } = req.body;
        const examName = new ExamName({ name, session });
        await examName.save();
        res.status(201).json(examName);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all exam names
router.get('/', async (req, res) => {
    try {
        const examNames = await ExamName.find();
        res.status(200).json(examNames);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a single exam name by ID
router.get('/:id', async (req, res) => {
    try {
        const examName = await ExamName.findById(req.params.id);

        if (!examName) {
            return res.status(404).json({ error: 'Exam name not found' });
        }

        res.status(200).json(examName);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update an exam name by ID
router.put('/:id', async (req, res) => {
    try {
        const { name, session } = req.body;
        const updatedExamName = await ExamName.findByIdAndUpdate(
            req.params.id,
            { name, session },
            { new: true }
        );

        if (!updatedExamName) {
            return res.status(404).json({ error: 'Exam name not found' });
        }

        res.status(200).json(updatedExamName);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete an exam name by ID
router.delete('/:id', async (req, res) => {
    try {
        const examName = await ExamName.findByIdAndDelete(req.params.id);

        if (!examName) {
            return res.status(404).json({ error: 'Exam name not found' });
        }

        res.status(200).json({ message: 'Exam name deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
