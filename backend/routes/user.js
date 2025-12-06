// backend/routes/users.js
const express = require("express");
const router = express.Router();
const db = require("../config/mysql.js");
const { protect } = require("../Middleware/authmiddleware"); // Import Protection

// ==========================
// GET ALL USERS (ADMIN ONLY)
// ==========================
router.get("/", protect(['Admin']), async (req, res) => {
    try {
        // Tanging Admin lang ang makakarating dito
        const [rows] = await db.execute("SELECT UserID, FirstName, LastName, Role, EmailAddress FROM Users");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ... (Other routes like GET BY ID, PUT, DELETE are secured similarly if needed) ...

module.exports = router;