const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');

// Create a new subject
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;
        const subject = new Subject({ name });
        await subject.save();
        res.status(201).json(subject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all subjects
router.get('/', async (req, res) => {
    try {
        const subjects = await Subject.find();
        res.status(200).json(subjects);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a subject by ID
router.get('/:id', async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.status(200).json(subject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a subject
router.put('/:id', async (req, res) => {
    try {
        const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.status(200).json(subject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a subject
router.delete('/:id', async (req, res) => {
    try {
        const subject = await Subject.findByIdAndDelete(req.params.id);
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
