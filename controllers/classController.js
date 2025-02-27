// Import necessary modules
const Class = require('../models/class.js');

// Controller methods
const classController = {
    // Create a new class
    createClass: async (req, res) => {
        try {
            const tenantId = req.user.tenantId; // Extract tenant ID from authenticated user
            const { name, sections } = req.body;

            // Ensure the class name is unique within the tenant
            const existingClass = await Class.findOne({ name, tenantId });
            if (existingClass) {
                return res.status(400).json({ error: 'Class name already exists in this tenant' });
            }

            // Create a new class with tenantId
            const newClass = new Class({
                tenantId,
                name,
                sections
            });

            // Save the new class to the database
            const savedClass = await newClass.save();
            res.status(201).json(savedClass);
        } catch (error) {
            console.error('Error creating class:', error);
            res.status(500).json({ error: 'Failed to create class' });
        }
    },

    // Get all classes within the tenant
    getAllClasses: async (req, res) => {
        try {
            const tenantId = req.user.tenantId;
            
            // Retrieve all classes belonging to the tenant
            const classes = await Class.find({ tenantId });
            res.status(200).json(classes);
        } catch (error) {
            console.error('Error fetching classes:', error);
            res.status(500).json({ error: 'Failed to fetch classes' });
        }
    },

    // Get a single class by ID (scoped to tenant)
    getClassById: async (req, res) => {
        try {
            const classId = req.params.id;
            const tenantId = req.user.tenantId;

            // Retrieve the class by ID and tenantId
            const classObj = await Class.findOne({ _id: classId, tenantId });
            if (!classObj) {
                return res.status(404).json({ error: 'Class not found or access denied' });
            }

            res.status(200).json(classObj);
        } catch (error) {
            console.error('Error fetching class by ID:', error);
            res.status(500).json({ error: 'Failed to fetch class' });
        }
    },

    // Update a class by ID (scoped to tenant)
    updateClassById: async (req, res) => {
        try {
            const classId = req.params.id;
            const tenantId = req.user.tenantId;
            const { name, sections } = req.body;

            // Ensure the class exists within the tenant
            const classObj = await Class.findOne({ _id: classId, tenantId });
            if (!classObj) {
                return res.status(404).json({ error: 'Class not found or access denied' });
            }

            // Ensure new class name is unique within the tenant
            if (name && name !== classObj.name) {
                const existingClass = await Class.findOne({ name, tenantId });
                if (existingClass) {
                    return res.status(400).json({ error: 'Class name already exists in this tenant' });
                }
            }

            // Update the class fields
            classObj.name = name || classObj.name;
            classObj.sections = sections || classObj.sections;

            const updatedClass = await classObj.save();
            res.status(200).json(updatedClass);
        } catch (error) {
            console.error('Error updating class by ID:', error);
            res.status(500).json({ error: 'Failed to update class' });
        }
    },

    // Delete a class by ID (scoped to tenant)
    deleteClassById: async (req, res) => {
        try {
            const classId = req.params.id;
            const tenantId = req.user.tenantId;

            // Ensure the class exists within the tenant
            const classObj = await Class.findOne({ _id: classId, tenantId });
            if (!classObj) {
                return res.status(404).json({ error: 'Class not found or access denied' });
            }

            // Delete the class
            await classObj.deleteOne();
            res.status(200).json({ message: 'Class deleted successfully' });
        } catch (error) {
            console.error('Error deleting class by ID:', error);
            res.status(500).json({ error: 'Failed to delete class' });
        }
    }
};

// Export the controller
module.exports = classController;
