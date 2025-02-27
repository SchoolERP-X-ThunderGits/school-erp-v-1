const Section = require('../models/section.js');

const sectionController = {
    // Create a new section (Scoped to Tenant)
    createSection: async (req, res) => {
        try {
            const tenantId = req.user.tenantId; // Extract tenant ID from authenticated user
            const { name } = req.body;

            // Ensure section name is unique within the tenant
            const existingSection = await Section.findOne({ name, tenantId });
            if (existingSection) {
                return res.status(400).json({ error: 'Section name already exists in this tenant' });
            }

            // Create a new section with tenantId
            const section = new Section({ tenantId, name });
            await section.save();

            res.status(201).json({ message: 'Section created successfully', section });
        } catch (error) {
            console.error('Error creating section:', error);
            res.status(500).json({ error: 'Failed to create section' });
        }
    },

    // Get all sections (Scoped to Tenant)
    getAllSections: async (req, res) => {
        try {
            const tenantId = req.user.tenantId;
            const sections = await Section.find({ tenantId });

            res.status(200).json(sections);
        } catch (error) {
            console.error('Error fetching sections:', error);
            res.status(500).json({ error: 'Failed to fetch sections' });
        }
    },

    // Get a specific section by ID (Scoped to Tenant)
    getSectionById: async (req, res) => {
        try {
            const { id } = req.params;
            const tenantId = req.user.tenantId;

            const section = await Section.findOne({ _id: id, tenantId });
            if (!section) {
                return res.status(404).json({ error: 'Section not found or access denied' });
            }

            res.status(200).json(section);
        } catch (error) {
            console.error('Error fetching section by ID:', error);
            res.status(500).json({ error: 'Failed to fetch section' });
        }
    },

    // Update a section (Scoped to Tenant)
    updateSection: async (req, res) => {
        try {
            const { id } = req.params;
            const tenantId = req.user.tenantId;
            const { name } = req.body;

            // Find section within the tenant
            const section = await Section.findOne({ _id: id, tenantId });
            if (!section) {
                return res.status(404).json({ error: 'Section not found or access denied' });
            }

            // Ensure the new name is unique within the tenant
            if (name && name !== section.name) {
                const existingSection = await Section.findOne({ name, tenantId });
                if (existingSection) {
                    return res.status(400).json({ error: 'Section name already exists in this tenant' });
                }
            }

            section.name = name || section.name;
            await section.save();

            res.status(200).json({ message: 'Section updated successfully', section });
        } catch (error) {
            console.error('Error updating section:', error);
            res.status(500).json({ error: 'Failed to update section' });
        }
    },

    // Delete a section (Scoped to Tenant)
    deleteSection: async (req, res) => {
        try {
            const { id } = req.params;
            const tenantId = req.user.tenantId;

            const section = await Section.findOne({ _id: id, tenantId });
            if (!section) {
                return res.status(404).json({ error: 'Section not found or access denied' });
            }

            await section.deleteOne();
            res.status(200).json({ message: 'Section deleted successfully' });
        } catch (error) {
            console.error('Error deleting section:', error);
            res.status(500).json({ error: 'Failed to delete section' });
        }
    }
};

module.exports = sectionController;
