const express = require('express');
const router = express.Router();
const ExamName = require('../models/examName');
const authMiddleware = require("../middleware/auth.js");

router.post('/', authMiddleware(), async (req, res) => {
    const { name, session } = req.body;
    const tenantId = req.user.tenantId; // Assuming tenantId is set on req.user by some middleware
    try {
        const examName = new ExamName({ name, session, tenantId });
        await examName.save();
        res.status(201).json(examName);
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ error: 'An exam with this name already exists in your tenant.' });
        } else {
            res.status(400).json({ error: err.message });
        }
    }
});

// Get all exam names for the tenant
router.get('/', authMiddleware(), async (req, res) => {
    const tenantId = req.user.tenantId; // Assuming tenantId is set on req.user by some middleware
    try {
        const examNames = await ExamName.find({ tenantId });
        res.status(200).json(examNames);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a single exam name by ID scoped to tenant
router.get('/:id', authMiddleware(), async (req, res) => {
    const tenantId = req.user.tenantId;
    try {
        const examName = await ExamName.findOne({ _id: req.params.id, tenantId });

        if (!examName) {
            return res.status(404).json({ error: 'Exam name not found' });
        }

        res.status(200).json(examName);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update an exam name by ID scoped to tenant
router.put('/:id', authMiddleware(), async (req, res) => {
    const { name, session } = req.body;
    const tenantId = req.user.tenantId;
    try {
        const updatedExamName = await ExamName.findOneAndUpdate(
            { _id: req.params.id, tenantId },
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

// Delete an exam name by ID scoped to tenant
router.delete('/:id', authMiddleware(), async (req, res) => {
    const tenantId = req.user.tenantId;
    try {
        const examName = await ExamName.findOneAndDelete({ _id: req.params.id, tenantId });

        if (!examName) {
            return res.status(404).json({ error: 'Exam name not found' });
        }

        res.status(200).json({ message: 'Exam name deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
