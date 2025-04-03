const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');
const authMiddleware = require("../middleware/auth.js");

router.post('/', authMiddleware(), async (req, res) => {
    const { name } = req.body;
    const tenantId = req.user.tenantId; // Assuming tenantId is set on req.user by some middleware

    try {
        // Check if the subject already exists in the tenant
        const existingSubject = await Subject.findOne({ name, tenantId });
        if (existingSubject) {
            return res.status(409).json({ error: 'A subject with this name already exists for your tenant.' });
        }

        const subject = new Subject({ name, tenantId });
        await subject.save();
        res.status(201).json(subject);
    } catch (err) {
        // Catch any other errors, possibly from the database
        res.status(400).json({ error: err.message });
    }
});


// Get all subjects for a tenant
router.get('/', authMiddleware(), async (req, res) => {
    const tenantId = req.user.tenantId;

    try {
        const subjects = await Subject.find({ tenantId });
        res.status(200).json(subjects);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a subject by ID, scoped to tenant
router.get('/:id', authMiddleware(), async (req, res) => {
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
router.put('/:id', authMiddleware(), async (req, res) => {
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
router.delete('/:id', authMiddleware(), async (req, res) => {
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
