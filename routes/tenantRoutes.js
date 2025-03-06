const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const authMiddleware = require("../middleware/auth.js");

// Create a new tenant (Super Admin only)
router.post('/', authMiddleware(['superadmin']), tenantController.createTenant);

// Get all tenants (Super Admin only)
router.get('/', authMiddleware(['superadmin']), tenantController.getAllTenants);

// Get a single tenant by ID (Super Admin only)
router.get('/:id', authMiddleware(['admin']), tenantController.getTenantById);

// Get tenant details for the logged-in user
router.get('/me', authMiddleware(['admin', 'moderator']), tenantController.getMyTenant);

// Update tenant details (Tenant Admin)
router.put('/:id', authMiddleware(['admin']), tenantController.updateMyTenant);

// Delete a tenant (Super Admin only)
router.delete('/:id', authMiddleware(['superadmin']), tenantController.deleteTenant);

module.exports = router;
