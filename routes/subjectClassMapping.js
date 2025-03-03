const express = require('express');
const router = express.Router();
const SubjectClassMapping = require('../models/subjectClassMapping');
const Class = require('../models/class');
const Subject = require('../models/subject');

// Create a new subject-class mapping
router.post('/', async (req, res) => {
    const { classId, subjects } = req.body;
    const tenantId = req.user.tenantId; // Assuming tenantId is set on req.user by some middleware

    try {
        const classDoc = await Class.findOne({ _id: classId, tenantId });
        if (!classDoc) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Ensure all subjects are valid and belong to the tenant
        const subjectDocs = await Subject.find({ '_id': { $in: subjects }, tenantId });
        if (subjectDocs.length !== subjects.length) {
            return res.status(400).json({ error: 'Some subjects are invalid' });
        }

        const mapping = new SubjectClassMapping({ tenantId, class: classId, subjects });
        await mapping.save();
        res.status(201).json(mapping);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all subject-class mappings for a tenant
router.get('/', async (req, res) => {
    const tenantId = req.user.tenantId;

    try {
        const mappings = await SubjectClassMapping.find({ tenantId }).populate('class subjects');
        res.status(200).json(mappings);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a subject-class mapping by ID, scoped to tenant
router.get('/:id', async (req, res) => {
    const tenantId = req.user.tenantId;

    try {
        const mapping = await SubjectClassMapping.findOne({ _id: req.params.id, tenantId }).populate('class subjects');
        if (!mapping) {
            return res.status(404).json({ error: 'Mapping not found' });
        }
        res.status(200).json(mapping);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a subject-class mapping, scoped to tenant
router.put('/:id', async (req, res) => {
    const { classId, subjects } = req.body;
    const tenantId = req.user.tenantId;

    try {
        const classDoc = await Class.findOne({ _id: classId, tenantId });
        if (!classDoc) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Ensure all subjects are valid and belong to the tenant
        const subjectDocs = await Subject.find({ '_id': { $in: subjects }, tenantId });
        if (subjectDocs.length !== subjects.length) {
            return res.status(400).json({ error: 'Some subjects are invalid' });
        }

        const updatedMapping = await SubjectClassMapping.findOneAndUpdate(
            { _id: req.params.id, tenantId },
            { class: classId, subjects },
            { new: true }
        ).populate('class subjects');

        if (!updatedMapping) {
            return res.status(404).json({ error: 'Mapping not found' });
        }

        res.status(200).json(updatedMapping);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a subject-class mapping, scoped to tenant
router.delete('/:id', async (req, res) => {
    const tenantId = req.user.tenantId;

    try {
        const mapping = await SubjectClassMapping.findOneAndDelete({ _id: req.params.id, tenantId });
        if (!mapping) {
            return res.status(404).json({ error: 'Mapping not found' });
        }
        res.status(200).json({ message: 'Mapping deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
