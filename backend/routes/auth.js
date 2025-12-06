const express = require("express");
const router = express.Router();
const db = require("../config/mysql.js"); // Import ng database connection (dapat ito ang tamang path)
const bcrypt = require("bcrypt"); // Para sa password hashing
const jwt = require("jsonwebtoken"); // Para sa token generation

// IMPORTANT: Palitan ito ng mas mahaba at mas secure na key!
const JWT_SECRET = "YourSuperSecureSecretKeyThatMustBeLong";

// ==========================
// REGISTER USER (Student/Instructor Only)
// ==========================
router.post("/register", async (req, res) => {
    try {
        const {
            StudentID, LastName, FirstName, MI, EmailAddress, Password,
            Birthday, Address, ContactNumber, Course, Role // Kinukuha ang Role
        } = req.body;
        
        // --- VALIDATION: Allowed Roles ---
        const allowedRoles = ['Student', 'Instructor'];
        
        // Huwag payagan kung walang role o kung ang role ay 'Admin'
        if (!Role || !allowedRoles.includes(Role)) {
            return res.status(400).json({ message: "Invalid role selected. Must be Student or Instructor." });
        }
        // ---------------------------------

        const hashedPassword = await bcrypt.hash(Password, 10);

        const sql = `
            INSERT INTO Users 
            (StudentID, LastName, FirstName, MI, EmailAddress, Password,
             Birthday, Address, ContactNumber, Course, Role, DateRegistered)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW()) 
        `;

        await db.execute(sql, [
            StudentID, LastName, FirstName, MI, EmailAddress, 
            hashedPassword, Birthday, Address, ContactNumber, Course, Role 
        ]);

        res.status(201).json({ message: `User registered successfully as ${Role}` });

    } catch (error) {
        console.error("Registration Error:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: "Registration failed: User already exists (ID or Email)." });
        }
        res.status(500).json({ message: "Registration failed due to server error." });
    }
});

// ==========================
// LOGIN USER (JWT Token Generation)
// ==========================
router.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const sql = `
            SELECT * FROM Users 
            WHERE StudentID = ? OR EmailAddress = ?
        `;

        const [rows] = await db.execute(sql, [identifier, identifier]);
        if (rows.length === 0) return res.status(404).json({ message: "User not found" });

        const user = rows[0];

        // 1. Password Verification
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) return res.status(401).json({ message: "Invalid password" });

        // 2. Generate JWT Token
        const token = jwt.sign(
            {
                // Ang mga ito ang babasahin ng jwtDecode sa React
                UserID: user.UserID, 
                Role: user.Role, // CRITICAL: Ito ang magdi-determine ng dashboard!
                FirstName: user.FirstName,
            },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        // 3. Ibalik ang Token at Role sa React
        res.json({
            message: "Login successful",
            token: token, 
            role: user.Role 
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Login error due to server issue." });
    }
});

module.exports = router;