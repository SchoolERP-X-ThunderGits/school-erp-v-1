const express = require('express');
const router = express.Router();
const SubjectClassMapping = require('../models/subjectClassMapping');
const Class = require('../models/class');
const Subject = require('../models/subject');

// Create a new subject-class mapping
router.post('/', async (req, res) => {
    try {
        const { classId, subjects } = req.body;
        const classDoc = await Class.findById(classId);
        if (!classDoc) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Ensure all subjects are valid
        const subjectDocs = await Subject.find({ '_id': { $in: subjects } });
        if (subjectDocs.length !== subjects.length) {
            return res.status(400).json({ error: 'Some subjects are invalid' });
        }

        const mapping = new SubjectClassMapping({ class: classId, subjects });
        await mapping.save();
        res.status(201).json(mapping);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all subject-class mappings
router.get('/', async (req, res) => {
    try {
        const mappings = await SubjectClassMapping.find().populate('class subjects');
        res.status(200).json(mappings);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get a subject-class mapping by ID
router.get('/:id', async (req, res) => {
    try {
        const mapping = await SubjectClassMapping.findById(req.params.id).populate('class subjects');
        if (!mapping) {
            return res.status(404).json({ error: 'Mapping not found' });
        }
        res.status(200).json(mapping);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a subject-class mapping
router.put('/:id', async (req, res) => {
    try {
        const { classId, subjects } = req.body;
        const classDoc = await Class.findById(classId);
        if (!classDoc) {
            return res.status(404).json({ error: 'Class not found' });
        }

        // Ensure all subjects are valid
        const subjectDocs = await Subject.find({ '_id': { $in: subjects } });
        if (subjectDocs.length !== subjects.length) {
            return res.status(400).json({ error: 'Some subjects are invalid' });
        }

        const updatedMapping = await SubjectClassMapping.findByIdAndUpdate(
            req.params.id,
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

// Delete a subject-class mapping
router.delete('/:id', async (req, res) => {
    try {
        const mapping = await SubjectClassMapping.findByIdAndDelete(req.params.id);
        if (!mapping) {
            return res.status(404).json({ error: 'Mapping not found' });
        }
        res.status(200).json({ message: 'Mapping deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
