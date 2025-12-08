const db = require("../config/mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;


// ===============================
// REGISTER CONTROLLER
// ===============================

exports.registerUser = async (req, res) => {
    try {
        const {
            user_role, user_fn, user_ln,
            email, password, stud_id, stud_course
        } = req.body;

        // 1. Input Validation
        const allowedRoles = ["admin" ,"student", "staff", "uo_staff"];
        if (!allowedRoles.includes(user_role.toLowerCase())) {
            return res.status(400).json({
                message: "Invalid role. Allowed roles: student, staff, uo_staff."
            });
        }
        
        // --- FIX: Safely map input to prevent 'undefined' bind error ---
        const safe_user_fn = user_fn || null;
        const safe_user_ln = user_ln || null;
        const safe_stud_id = stud_id || null;
        const safe_stud_course = stud_course || null;
        // ---------------------------------------------------------------

        // 2. Generate user_code based on LAST user_id (Global Sequence)
        // NOTE: This logic creates a GLOBAL sequence based on the highest user_id + 1.
        // If stud_id is required, it must be validated above.

        const [lastRow] = await db.execute(
            `SELECT user_id FROM tbl_users ORDER BY user_id DESC LIMIT 1`
        );

        let increment = 1;

        if (lastRow.length > 0) {
            // Increment the number based on the last known user_id
            increment = lastRow[0].user_id + 1; 
        }

        const paddingLength = 4;
        const newIncrementStr = String(increment).padStart(paddingLength, "0");
        
        // FIX: If stud_id is null, this code will be 'LMS-null-000X'. 
        // We use the safe_stud_id variable here.
        const user_code = `LMS-${safe_stud_id}-${newIncrementStr}`;
        // -----------------------------------------------------------

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Insert into database
        const sql = `
            INSERT INTO tbl_users 
            (user_code, user_role, user_fn, user_ln, email, password, stud_id, stud_course, date_registered)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        await db.execute(sql, [
            user_code,
            user_role.toLowerCase(),
            safe_user_fn,         // Use safe variable
            safe_user_ln,         // Use safe variable
            email,
            hashedPassword,
            safe_stud_id,         // Use safe variable
            safe_stud_course      // Use safe variable
        ]);

        res.status(201).json({
            message: "User registered successfully.",
            user_code: user_code
        });

    } catch (error) {
        console.error("Registration Error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                message: "User already exists (email or student/employee ID is taken)."
            });
        }

        res.status(500).json({ message: "Server error during registration." });
    }
};

// ===============================
// LOGIN CONTROLLER
// ===============================
exports.loginUser = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        // identifier = user_code OR email
        const sql = `SELECT * FROM tbl_users WHERE user_code = ? OR email = ?`;

        const [rows] = await db.execute(sql, [identifier, identifier]);

        // If no user found
        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const user = rows[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password." });
        }

        // Create token
        const token = jwt.sign(
            {
                user_id: user.user_id,
                user_code: user.user_code,
                user_role: user.user_role,
                user_fn: user.user_fn,
                user_ln: user.user_ln
            },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            message: "Login successful.",
            token,
            role: user.user_role
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error during login." });
    }
};
