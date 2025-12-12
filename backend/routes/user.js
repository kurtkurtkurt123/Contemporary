const express = require("express");
const router = express.Router();
const db = require("../config/supabase.js");
const { protect } = require("../Middleware/authmiddleware");

// GET ALL USERS — Admin only
router.get("/", protect(['admin']), async (req, res) => {
    try {
        const { data, error } = await db
            .from("Users")
            .select("UserID, FirstName, LastName, Role, EmailAddress");

        if (error) return res.status(500).json({ message: error.message });

        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
