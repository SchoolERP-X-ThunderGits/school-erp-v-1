// controllers/loginController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Parent = require('../models/parent');
const Tenant = require('../models/tenant');
const config = require('../config/config');

exports.userLogin = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        let user;

        // Determine the user type based on role
        if (role === 'admin' || role === 'moderator') {
            user = await User.findOne({ username }) // Exclude password
        } else if (role === 'parent') {
            user = await Parent.findOne({ username }) // Exclude password
        } else {
            return res.status(400).json({ message: 'Invalid role' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Fetch tenant details based on user's tenantId
        let tenantDetails = null;
        if (user.tenantId) {
            tenantDetails = await Tenant.findById(user.tenantId).select('-admin'); // Exclude admin field
        }

        // Generate JWT token with tenantId
        const token = jwt.sign(
            { id: user._id, tenantId: user.tenantId, role: user.role },
            config.auth.jwtSecret,
            { expiresIn: config.auth.tokenExpiration }
        );

        // Log successful login attempt
        console.log(`User with username ${username} and role ${role} logged in successfully`);

        // Send response including tenant details
        res.json({
            user,
            tenant: tenantDetails,
            token,
            message: "Successful Login"
        });
    } catch (error) {
        console.error('User login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
