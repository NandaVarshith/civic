const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        // 1. Get token from the httpOnly cookie
        const token = req.cookies.token;

        // 2. If no token, user is not authenticated
        if (!token) {
            return res.status(401).json({ message: "Authentication failed: No token provided." });
        }

        // 3. Verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Attach the decoded payload (e.g., { userId, role }) to the request object
        req.user = decoded;

        // 5. Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Differentiate between client-side token errors and server-side issues.
        if (error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError') {
            // These errors are expected if the client sends a bad or expired token.
            return res.status(401).json({ message: "Authentication failed: Invalid or expired token." });
        }

        // For other errors (e.g., JWT_SECRET not provided), it's a server issue.
        // Pass it to the global error handler in index.js.
        next(error);
    }
};

module.exports = { auth };