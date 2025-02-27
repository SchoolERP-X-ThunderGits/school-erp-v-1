const Tenant = require('../models/tenant');
const qrCode = require('qrcode'); // To generate QR codes dynamically

const tenantController = {
    // Create a new tenant (Super Admin only)
    createTenant: async (req, res) => {
        try {
            const { name, subdomain, admin, contactNumber, email, address, website, plan } = req.body;

            // Ensure subdomain is unique
            const existingTenant = await Tenant.findOne({ subdomain });
            if (existingTenant) {
                return res.status(400).json({ error: 'Subdomain already exists' });
            }

            // Generate QR code for website if provided
            let qrCodeUrl = null;
            if (website) {
                qrCodeUrl = await qrCode.toDataURL(website);
            }

            const newTenant = new Tenant({
                name,
                subdomain,
                admin,
                contactNumber,
                email,
                address,
                website,
                qrCodeUrl,
                plan
            });

            await newTenant.save();
            res.status(201).json({ message: 'Tenant created successfully', tenant: newTenant });
        } catch (error) {
            console.error('Error creating tenant:', error);
            res.status(500).json({ error: 'Failed to create tenant' });
        }
    },

    // Get all tenants (Super Admin only)
    getAllTenants: async (req, res) => {
        try {
            const tenants = await Tenant.find();
            res.status(200).json(tenants);
        } catch (error) {
            console.error('Error fetching tenants:', error);
            res.status(500).json({ error: 'Failed to fetch tenants' });
        }
    },

    // Get a specific tenant by ID (Super Admin only)
    getTenantById: async (req, res) => {
        try {
            const tenant = await Tenant.findById(req.params.id);
            if (!tenant) {
                return res.status(404).json({ error: 'Tenant not found' });
            }
            res.status(200).json(tenant);
        } catch (error) {
            console.error('Error fetching tenant by ID:', error);
            res.status(500).json({ error: 'Failed to fetch tenant' });
        }
    },

    // Get tenant details for the logged-in user
    getMyTenant: async (req, res) => {
        try {
            const tenantId = req.user.tenantId; // Get tenantId from logged-in user
            const tenant = await Tenant.findById(tenantId);
            if (!tenant) {
                return res.status(404).json({ error: 'Tenant not found' });
            }
            res.status(200).json(tenant);
        } catch (error) {
            console.error('Error fetching tenant details:', error);
            res.status(500).json({ error: 'Failed to fetch tenant details' });
        }
    },

    // Update tenant details (Tenant Admin)
    updateMyTenant: async (req, res) => {
        try {
            const tenantId = req.user.tenantId;
            const { name, contactNumber, email, address, website, plan, themeSettings } = req.body;

            let updatedFields = { name, contactNumber, email, address, plan, themeSettings };

            // Generate QR code for website if updated
            if (website) {
                updatedFields.website = website;
                updatedFields.qrCodeUrl = await qrCode.toDataURL(website);
            }

            const updatedTenant = await Tenant.findByIdAndUpdate(tenantId, updatedFields, { new: true });
            if (!updatedTenant) {
                return res.status(404).json({ error: 'Tenant not found or access denied' });
            }

            res.status(200).json({ message: 'Tenant updated successfully', tenant: updatedTenant });
        } catch (error) {
            console.error('Error updating tenant:', error);
            res.status(500).json({ error: 'Failed to update tenant' });
        }
    },

    // Delete a tenant (Super Admin only)
    deleteTenant: async (req, res) => {
        try {
            const tenant = await Tenant.findById(req.params.id);
            if (!tenant) {
                return res.status(404).json({ error: 'Tenant not found' });
            }

            await tenant.deleteOne();
            res.status(200).json({ message: 'Tenant deleted successfully' });
        } catch (error) {
            console.error('Error deleting tenant:', error);
            res.status(500).json({ error: 'Failed to delete tenant' });
        }
    }
};

module.exports = tenantController;
