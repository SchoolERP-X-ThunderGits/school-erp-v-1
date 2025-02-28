// Import necessary modules
const FeeStructure = require('../../models/fees/feeStructure.js');

// Controller methods
const feeStructureController = {
    // Create a new fee structure
    createFeeStructure: async (req, res) => {
        try {
            const tenantId = req.user.tenantId; // Extract tenant ID from authenticated user
            const { name, class: classId, feeGroups } = req.body;

            // Create a new fee structure scoped to the tenant
            const newFeeStructure = new FeeStructure({
                tenantId,
                name,
                class: classId,
                feeGroups
            });

            // Save the new fee structure to the database
            const savedFeeStructure = await newFeeStructure.save();
            res.status(201).json(savedFeeStructure);
        } catch (error) {
            console.error('Error creating fee structure:', error);
            res.status(500).json({ error: 'Failed to create fee structure' });
        }
    },

    // Get all fee structures within the tenant
    getAllFeeStructures: async (req, res) => {
        try {
            const tenantId = req.user.tenantId;

            // Retrieve all fee structures belonging to the tenant
            const feeStructures = await FeeStructure.find({ tenantId }).populate('class');
            res.status(200).json(feeStructures);
        } catch (error) {
            console.error('Error fetching fee structures:', error);
            res.status(500).json({ error: 'Failed to fetch fee structures' });
        }
    },

    // Get a single fee structure by ID (scoped to tenant)
    getFeeStructureById: async (req, res) => {
        try {
            const feeStructureId = req.params.id;
            const tenantId = req.user.tenantId;

            // Retrieve the fee structure by ID and tenantId
            const feeStructure = await FeeStructure.findOne({ _id: feeStructureId, tenantId }).populate('class');
            if (!feeStructure) {
                return res.status(404).json({ error: 'Fee structure not found or access denied' });
            }
            res.status(200).json(feeStructure);
        } catch (error) {
            console.error('Error fetching fee structure by ID:', error);
            res.status(500).json({ error: 'Failed to fetch fee structure' });
        }
    },

    // Update a fee structure by ID (scoped to tenant)
    updateFeeStructureById: async (req, res) => {
        try {
            const feeStructureId = req.params.id;
            const tenantId = req.user.tenantId;
            const { name, class: classId, feeGroups } = req.body;

            // Ensure the fee structure exists within the tenant
            const feeStructure = await FeeStructure.findOneAndUpdate(
                { _id: feeStructureId, tenantId },
                { name, class: classId, feeGroups },
                { new: true }
            );
            if (!feeStructure) {
                return res.status(404).json({ error: 'Fee structure not found or access denied' });
            }
            res.status(200).json(feeStructure);
        } catch (error) {
            console.error('Error updating fee structure by ID:', error);
            res.status(500).json({ error: 'Failed to update fee structure' });
        }
    },

    // Delete a fee structure by ID (scoped to tenant)
    deleteFeeStructureById: async (req, res) => {
        try {
            const feeStructureId = req.params.id;
            const tenantId = req.user.tenantId;

            // Ensure the fee structure exists within the tenant
            const deletedFeeStructure = await FeeStructure.findOneAndDelete({ _id: feeStructureId, tenantId });
            if (!deletedFeeStructure) {
                return res.status(404).json({ error: 'Fee structure not found or access denied' });
            }
            res.status(200).json({ message: 'Fee structure deleted successfully' });
        } catch (error) {
            console.error('Error deleting fee structure by ID:', error);
            res.status(500).json({ error: 'Failed to delete fee structure' });
        }
    }
};

// Export the controller
module.exports = feeStructureController;
