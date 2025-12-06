// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const JWT_SECRET = "YourSuperSecureSecretKeyThatMustBeLong"; // Dapat KAPAREHO ng nasa auth.js

const protect = (allowedRoles) => (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // I-check kung ang Role ay tugma
            if (!allowedRoles.includes(decoded.Role)) {
                return res.status(403).json({ message: "Access denied: Insufficient privileges." });
            }

            req.user = decoded; 
            next(); 
        
        } catch (error) {
            return res.status(401).json({ message: "Not authorized, token failed or expired." });
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided." });
    }
};

module.exports = { protect };