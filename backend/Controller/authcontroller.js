const db = require("../config/mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;


// ===============================
// REGISTER CONTROLLER
// ===============================

exports.registerUser = async (req, res) => {
    // Note: The user_code is now GENERATED, not received in req.body
    try {
        const {
            user_role, user_fn, user_ln,
            email, password, stud_id, stud_course
        } = req.body;

        // 1. Input Validation
        const allowedRoles = ["student", "staff", "uo_staff"];
        if (!allowedRoles.includes(user_role.toLowerCase())) {
            return res.status(400).json({
                message: "Invalid role. Allowed roles: student, staff."
            });
        }
        
        // 2. Generate the Next user_code (LMS-{stud_id}-00{increment})
        
        // a. Determine the prefix based on stud_id (e.g., 'LMS-23-2722')
        const userCodePrefix = `LMS-${stud_id}`;
        
        // b. Query the database to find the highest existing increment for this stud_id prefix
        const [rows] = await db.execute(
            `SELECT user_code FROM tbl_users WHERE user_code LIKE ? ORDER BY user_code DESC LIMIT 1`,
            [`${userCodePrefix}-%`] // Searches for codes starting with the prefix
        );

        let increment = 1;
        
        if (rows.length > 0) {
            // If a previous code exists, extract and increment the number
            const lastCode = rows[0].user_code; // e.g., 'LMS-23-2722-001'
            
            // Extract the numerical part (001) from the end
            const parts = lastCode.split('-');
            const lastIncrementStr = parts[parts.length - 1]; // '001'
            
            // Convert to number, increment, and handle case where it might fail
            const lastIncrement = parseInt(lastIncrementStr, 10);
            if (!isNaN(lastIncrement)) {
                increment = lastIncrement + 1;
            }
        }
        
        // c. Format the new user_code (e.g., LMS-23-2722-002)
        // Use padStart(3, '0') to ensure 001, 002, ... 010, ...
        const newIncrementStr = String(increment).padStart(3, '0');
        const user_code = `${userCodePrefix}-${newIncrementStr}`;


        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Insert into database
        const sql = `
            INSERT INTO tbl_users 
            (user_code, user_role, user_fn, user_ln, email, password, stud_id, stud_course, date_registered)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        `;

        await db.execute(sql, [
            user_code, // Use the GENERATED code here
            user_role.toLowerCase(),
            user_fn,
            user_ln,
            email,
            hashedPassword,
            stud_id,
            stud_course
        ]);

        res.status(201).json({ 
            message: "User registered successfully.",
            user_code: user_code // Respond with the newly created code
        });

    } catch (error) {
        console.error("Registration Error:", error);

        if (error.code === "ER_DUP_ENTRY") {
            // This error might now refer to stud_id/email uniqueness constraints
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
