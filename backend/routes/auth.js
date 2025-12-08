const dotenv = require("dotenv");
const express = require("express");
const router = express.Router();
const db = require("../config/mysql.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// ==========================
// REGISTER USER
// ==========================
router.post("/register", async (req, res) => {
    try {
        const {
            user_code, user_role, user_fn, user_ln,
            email, password, stud_id, stud_course
        } = req.body;

        // Ensure roles are saved as PascalCase (Student, Instructor) for consistency
        const roleString = user_role.charAt(0).toUpperCase() + user_role.slice(1).toLowerCase();
        
        const allowedRoles = ['Student', 'Instructor']; // Added 'Instructor'
        if (!user_role || !allowedRoles.includes(roleString)) {
            return res.status(400).json({ message: "Invalid role. Must be Student or Instructor." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO tbl_users 
            (user_code, user_role, user_fn, user_ln, email, password, stud_id, stud_course, date_registered)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        await db.execute(sql, [
            user_code, roleString, user_fn, user_ln,
            email, hashedPassword, stud_id, stud_course
        ]);

        res.status(201).json({ message: `User registered successfully as ${roleString}` });

    } catch (error) {
        console.error("Registration Error:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "User already exists (code or email)." });
        }
        res.status(500).json({ message: "Server error during registration." });
    }
});

// ==========================
// LOGIN USER
// ==========================
router.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const sql = `SELECT * FROM tbl_users WHERE user_code = ? OR email = ?`;
        const [rows] = await db.execute(sql, [identifier, identifier]);
        if (rows.length === 0) return res.status(404).json({ message: "User not found" });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        // ✅ CRITICAL FIX: Use PascalCase keys in JWT payload to match frontend AuthContext/Home.jsx
        const token = jwt.sign({
            UserID: user.user_id, // For general identification
            UserCode: user.user_code,
            Role: user.user_role,       // <--- CRITICAL FIX: Ensures Home/ProtectedRoutes read the role
            FirstName: user.user_fn,
            LastName: user.user_ln
        }, JWT_SECRET, { expiresIn: '2h' });

        res.json({ 
            message: "Login successful", 
            token, 
            Role: user.user_role // Return the role outside the token as well
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
});

module.exports = router;