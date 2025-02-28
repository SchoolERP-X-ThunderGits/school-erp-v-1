// Import necessary modules
const FeeType = require('../../models/fees/feeType.js');

// Controller methods
const feeTypeController = {
    // Create a new fee type
    createFeeType: async (req, res) => {
        try {
            const tenantId = req.user.tenantId; // Extract tenant ID from authenticated user
            const { name, description } = req.body;

            // Ensure the fee type name is unique within the tenant
            const existingFeeType = await FeeType.findOne({ name, tenantId });
            if (existingFeeType) {
                return res.status(400).json({ error: 'Fee type name already exists in this tenant' });
            }

            // Create a new fee type with tenantId
            const newFeeType = new FeeType({
                tenantId,
                name,
                description
            });

            // Save the new fee type to the database
            const savedFeeType = await newFeeType.save();
            res.status(201).json(savedFeeType);
        } catch (error) {
            console.error('Error creating fee type:', error);
            res.status(500).json({ error: 'Failed to create fee type' });
        }
    },

    // Get all fee types within the tenant
    getAllFeeTypes: async (req, res) => {
        try {
            const tenantId = req.user.tenantId;
            
            // Retrieve all fee types belonging to the tenant
            const feeTypes = await FeeType.find({ tenantId });
            res.status(200).json(feeTypes);
        } catch (error) {
            console.error('Error fetching fee types:', error);
            res.status(500).json({ error: 'Failed to fetch fee types' });
        }
    },

    // Get a single fee type by ID (scoped to tenant)
    getFeeTypeById: async (req, res) => {
        try {
            const feeTypeId = req.params.id;
            const tenantId = req.user.tenantId;

            // Retrieve the fee type by ID and tenantId
            const feeType = await FeeType.findOne({ _id: feeTypeId, tenantId });
            if (!feeType) {
                return res.status(404).json({ error: 'Fee type not found or access denied' });
            }

            res.status(200).json(feeType);
        } catch (error) {
            console.error('Error fetching fee type by ID:', error);
            res.status(500).json({ error: 'Failed to fetch fee type' });
        }
    },

    // Update a fee type by ID (scoped to tenant)
    updateFeeTypeById: async (req, res) => {
        try {
            const feeTypeId = req.params.id;
            const tenantId = req.user.tenantId;
            const { name, description } = req.body;

            // Ensure the fee type exists within the tenant
            const feeType = await FeeType.findOne({ _id: feeTypeId, tenantId });
            if (!feeType) {
                return res.status(404).json({ error: 'Fee type not found or access denied' });
            }

            // Ensure new fee type name is unique within the tenant
            if (name && name !== feeType.name) {
                const existingFeeType = await FeeType.findOne({ name, tenantId });
                if (existingFeeType) {
                    return res.status(400).json({ error: 'Fee type name already exists in this tenant' });
                }
            }

            // Update the fee type fields
            feeType.name = name || feeType.name;
            feeType.description = description || feeType.description;

            const updatedFeeType = await feeType.save();
            res.status(200).json(updatedFeeType);
        } catch (error) {
            console.error('Error updating fee type by ID:', error);
            res.status(500).json({ error: 'Failed to update fee type' });
        }
    },

    // Delete a fee type by ID (scoped to tenant)
    deleteFeeTypeById: async (req, res) => {
        try {
            const feeTypeId = req.params.id;
            const tenantId = req.user.tenantId;

            // Ensure the fee type exists within the tenant
            const feeType = await FeeType.findOne({ _id: feeTypeId, tenantId });
            if (!feeType) {
                return res.status(404).json({ error: 'Fee type not found or access denied' });
            }

            // Delete the fee type
            await feeType.deleteOne();
            res.status(200).json({ message: 'Fee type deleted successfully' });
        } catch (error) {
            console.error('Error deleting fee type by ID:', error);
            res.status(500).json({ error: 'Failed to delete fee type' });
        }
    }
};

// Export the controller
module.exports = feeTypeController;
