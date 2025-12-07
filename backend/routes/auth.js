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

        const allowedRoles = ['student', 'staff']; // admin not allowed
        if (!user_role || !allowedRoles.includes(user_role.toLowerCase())) {
            return res.status(400).json({ message: "Invalid role. Must be student or staff." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = `
            INSERT INTO tbl_users 
            (user_code, user_role, user_fn, user_ln, email, password, stud_id, stud_course, date_registered)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        await db.execute(sql, [
            user_code, user_role.toLowerCase(), user_fn, user_ln,
            email, hashedPassword, stud_id, stud_course
        ]);

        res.status(201).json({ message: `User registered successfully as ${user_role}` });

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

        const token = jwt.sign({
            user_id: user.user_id,
            user_code: user.user_code,
            user_role: user.user_role,
            user_fn: user.user_fn,
            user_ln: user.user_ln
        }, JWT_SECRET, { expiresIn: '2h' });

        res.json({ message: "Login successful", token, role: user.user_role });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
});

module.exports = router;
