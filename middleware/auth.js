const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user'); // Updated to use Admin model

const authMiddleware = (allowedRoles = []) => {
    return async (req, res, next) => {
        console.log(req.body);
        
        // Extract token from headers
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: Missing token' });
        }

        try {
            // Verify JWT token
            const decodedToken = jwt.verify(token, config.auth.jwtSecret);

            // Fetch user details along with tenantId
            const user = await User.findById(decodedToken.id).select('username role tenantId');
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized: User not found' });
            }

            // Attach user & tenant info to request object
            req.user = {
                id: user._id,
                username: user.username,
                role: user.role,
                tenantId: user.tenantId // Attach tenant ID for multi-tenancy
            };

        } catch (error) {
            return res.status(401).json({ message: `Unauthorized: Invalid token - ${error.message}` });
        }

        // If no roles are specified, allow access
        if (allowedRoles.length === 0) {
            return next();
        }

        // Check if user role is permitted
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: Access denied' });
        }

        next();
    };
};

module.exports = authMiddleware;
