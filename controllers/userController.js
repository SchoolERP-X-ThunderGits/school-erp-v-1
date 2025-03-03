const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js'); // Updated to Admin model
const config = require('../config/config');
const Tenant = require('../models/tenant');


const qrCode = require('qrcode'); // To generate QR codes dynamically
const AdmissionNumber = require('../models/admissionNumber');



exports.addUser = async (req, res) => {
    const {
        username,
        password,
        email,
        fullName,
        role,
        subdomain,
        schoolName,
        website,
        contactNumber,
        address,
        plan,
        logo,
        primaryColor,
        secondaryColor,
        font,
        directorSignature,
        principalSignature,
        managerSignature,
        prefix  // Ensure prefix is included in the received body
    } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Username, password, and role are required' });
    }

    try {
        // Check if subdomain already exists (for new tenants)
        if (role === 'admin') {
            const existingTenant = await Tenant.findOne({ subdomain });
            if (existingTenant) {
                return res.status(400).json({ message: 'Subdomain already in use' });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user (Admin or Moderator)
        const newUser = new User({
            username,
            password: hashedPassword,
            email,
            fullName,
            role
        });

        // If user is an admin, create a new tenant
        let newTenant = null;
        if (role === 'admin') {
            // Generate QR code if a website is provided
            let qrCodeUrl = null;
            if (website) {
                qrCodeUrl = await qrCode.toDataURL(website);
            }

            newTenant = new Tenant({
                name: schoolName,
                subdomain,
                admin: newUser._id, // Assign the new user as the tenant's admin
                website,
                qrCodeUrl,
                contactNumber,
                address,
                plan: plan || "free", // Default to "free" if not provided
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

            await newTenant.save();

            // Also create an AdmissionNumber record for the new tenant
            const newAdmissionNumber = new AdmissionNumber({
                tenantId: newTenant._id,
                prefix  // Use the provided prefix
            });
            await newAdmissionNumber.save();

            newUser.tenantId = newTenant._id; // Link user to the created tenant
        }

        await newUser.save();

        res.status(201).json({
            message: 'User and Tenant created successfully',
            user: newUser,
            tenant: newTenant
        });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};



exports.getUsers = async (req, res) => {
    try {
        const tenantId = req.user.tenantId;

        // Fetch all users for the current tenant
        const users = await User.find({ tenantId }).select('-password'); // Exclude password for security

        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const tenantId = req.user.tenantId;

        // Fetch user by ID and ensure they belong to the same tenant
        const user = await User.findOne({ _id: userId, tenantId }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found or access denied' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    const userId = req.params.id;
    const { username, password, email, fullName, role } = req.body;

    try {
        const tenantId = req.user.tenantId;

        // Check if user exists within the same tenant
        let user = await User.findOne({ _id: userId, tenantId });
        if (!user) {
            return res.status(404).json({ message: 'User not found or access denied' });
        }

        // Update user fields
        user.username = username || user.username;
        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }
        user.email = email || user.email;
        user.fullName = fullName || user.fullName;
        user.role = role || user.role;

        await user.save();
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const tenantId = req.user.tenantId;

        // Check if user exists within the same tenant
        const user = await User.findOne({ _id: userId, tenantId });
        if (!user) {
            return res.status(404).json({ message: 'User not found or access denied' });
        }

        await user.deleteOne();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
