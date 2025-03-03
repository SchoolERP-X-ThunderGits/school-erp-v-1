const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');

// Create a new subject
router.post('/', async (req, res) => {
    const { name } = req.body;
    const tenantId = req.user.tenantId; // Assuming tenantId is set on req.user by some middleware

    try {
        const subject = new Subject({ name, tenantId });
        await subject.save();
        res.status(201).json(subject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all subjects for a tenant
router.get('/', async (req, res) => {
    const tenantId = req.user.tenantId;

    try {
        const subjects = await Subject.find({ tenantId });
        res.status(200).json(subjects);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a subject by ID, scoped to tenant
router.get('/:id', async (req, res) => {
    const tenantId = req.user.tenantId;

    try {
        const subject = await Subject.findOne({ _id: req.params.id, tenantId });
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.status(200).json(subject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a subject, scoped to tenant
router.put('/:id', async (req, res) => {
    const { name } = req.body;
    const tenantId = req.user.tenantId;

    try {
        const subject = await Subject.findOneAndUpdate(
            { _id: req.params.id, tenantId },
            { name },
            { new: true }
        );
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.status(200).json(subject);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a subject, scoped to tenant
router.delete('/:id', async (req, res) => {
    const tenantId = req.user.tenantId;

    try {
        const subject = await Subject.findOneAndDelete({ _id: req.params.id, tenantId });
        if (!subject) {
            return res.status(404).json({ error: 'Subject not found' });
        }
        res.status(200).json({ message: 'Subject deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
