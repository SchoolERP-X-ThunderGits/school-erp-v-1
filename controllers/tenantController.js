const Tenant = require('../models/tenant');
const qrCode = require('qrcode'); // To generate QR codes dynamically
const AdmissionNumber = require('../models/admissionNumber');

const tenantController = {
    // Create a new tenant (Super Admin only)
    createTenant: async (req, res) => {
        const {
            name,
            subdomain,
            admin,
            contactNumber,
            email,
            address,
            website,
            plan,
            logo,
            primaryColor,
            secondaryColor,
            font,
            directorSignature,
            principalSignature,
            managerSignature,
            prefix
        } = req.body;

        try {
            // Check for existing subdomain
            const existingTenant = await Tenant.findOne({ subdomain });
            if (existingTenant) {
                return res.status(400).json({ error: 'Subdomain already exists' });
            }

            const newTenant = new Tenant({
                name,
                subdomain,
                admin,
                contactNumber,
                email,
                address,
                website,
                plan,
                logo: logo || null,
                directorSignature,
                principalSignature,
                managerSignature,
                themeSettings: {
                    primaryColor: primaryColor || "#000000",
                    secondaryColor: secondaryColor || "#ffffff",
                    font: font || "Arial"
                }
            });

            const savedTenant = await newTenant.save();

            // Create AdmissionNumber entry
            const newAdmissionNumber = new AdmissionNumber({
                tenantId: savedTenant._id,
                prefix: prefix
            });

            await newAdmissionNumber.save();

            res.status(201).json({ message: 'Tenant and Admission Number created successfully', tenant: savedTenant });
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
            const {
                name,
                contactNumber,
                email,
                address,
                website,
                plan,
                logo,
                directorSignature,
                principalSignature,
                managerSignature,
                themeSettings
            } = req.body;

            let updatedFields = {
                name,
                contactNumber,
                email,
                address,
                plan
            };

            // Update logo if provided
            if (logo) {
                updatedFields.logo = logo;
            }

            // Update signatures if provided
            if (directorSignature) {
                updatedFields.directorSignature = directorSignature;
            }
            if (principalSignature) {
                updatedFields.principalSignature = principalSignature;
            }
            if (managerSignature) {
                updatedFields.managerSignature = managerSignature;
            }

            // Update theme settings if provided
            if (themeSettings) {
                updatedFields.themeSettings = {
                    primaryColor: themeSettings.primaryColor || "#000000",
                    secondaryColor: themeSettings.secondaryColor || "#ffffff",
                    font: themeSettings.font || "Arial"
                };
            }

            // Generate QR code for website if updated
            if (website) {
                updatedFields.website = website;
                updatedFields.qrCodeUrl = await qrCode.toDataURL(website);
            }

            const updatedTenant = await Tenant.findByIdAndUpdate(
                tenantId,
                { $set: updatedFields },
                { new: true }
            );

            if (!updatedTenant) {
                return res.status(404).json({ error: 'Tenant not found or access denied' });
            }

            res.status(200).json({
                message: 'Tenant updated successfully',
                tenant: updatedTenant
            });
        } catch (error) {
            console.error('Error updating tenant:', error);
            res.status(500).json({ error: 'Failed to update tenant' });
        }
    },

    // Delete a tenant (Super Admin only)
    deleteTenant: async (req, res) => {
        const tenantId = req.params.id;
        try {
            const tenant = await Tenant.findById(tenantId);
            if (!tenant) {
                return res.status(404).json({ error: 'Tenant not found' });
            }
            // Deleting all related data
            await Promise.all([
                // Delete all users associated with the tenant
                User.deleteMany({ tenantId }),
                // Delete all students associated with the tenant
                Student.deleteMany({ tenantId }),
                // Delete all admission numbers associated with the tenant
                AdmissionNumber.deleteOne({ tenantId }),
                // Delete all classes associated with the tenant
                Class.deleteMany({ tenantId }),
                // Delete all exam names associated with the tenant
                ExamName.deleteMany({ tenantId }),
                // Delete all exam schedules associated with the tenant
                ExamSchedule.deleteMany({ tenantId }),
                // Fees related deletions
                FeeStructure.deleteMany({ tenantId }),
                FeeType.deleteMany({ tenantId }),
                StudentFeeProfile.deleteMany({ tenantId }),
                // Delete all parent records associated with the tenant
                Parent.deleteMany({ tenantId }),
                // Delete all payments associated with the tenant
                Payment.deleteMany({ tenantId }),
                // Delete all sections associated with the tenant
                Section.deleteMany({ tenantId }),
                // Delete all subject class mappings associated with the tenant
                SubjectClassMapping.deleteMany({ tenantId }),
                // Delete all subjects associated with the tenant
                Subject.deleteMany({ tenantId })
            ]);
            // Finally, delete the tenant
            await tenant.deleteOne();
            res.status(200).json({ message: 'Tenant and all related data deleted successfully' });
        } catch (error) {
            console.error('Error deleting tenant:', error);
            res.status(500).json({ error: 'Failed to delete tenant' });
        }
    }
};

module.exports = tenantController;
