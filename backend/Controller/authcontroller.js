const supabase = require("../config/supabase");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;


// ===============================
// REGISTER CONTROLLER (SUPABASE)
// ===============================

exports.registerUser = async (req, res) => {
<<<<<<< HEAD
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
=======
  try {
    const {
      user_role, user_fn, user_ln,
      email, password, stud_id, stud_course
    } = req.body;

    const allowedRoles = ["admin", "student", "staff", "uo_staff"];
    if (!allowedRoles.includes(user_role.toLowerCase())) {
      return res.status(400).json({
        message: "Invalid role. Allowed roles: admin, student, staff, uo_staff."
      });
>>>>>>> test/supabase-migration
    }

    // Check if email already exists
    const { data: existing, error: checkErr } = await supabase
      .from("tbl_users")
      .select("email")
      .eq("email", email)
      .limit(1);

    if (checkErr) throw checkErr;

    if (existing && existing.length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }

    // Get last user_id
    const { data: lastUser, error: lastErr } = await supabase
      .from("tbl_users")
      .select("user_id")
      .order("user_id", { ascending: false })
      .limit(1);

    if (lastErr) throw lastErr;

    let increment = lastUser.length > 0 ? lastUser[0].user_id + 1 : 1;
    const newCode = String(increment).padStart(4, "0");

    const user_code = `LMS-${stud_id || "0000"}-${newCode}`;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const { error: insertErr } = await supabase
      .from("tbl_users")
      .insert({
        user_code,
        user_role: user_role.toLowerCase(),
        user_fn,
        user_ln,
        email,
        password: hashedPassword,
        stud_id: stud_id || null,
        stud_course: stud_course || null
      });

    if (insertErr) throw insertErr;

    res.status(201).json({
      message: "User registered successfully.",
      user_code
    });

  } catch (error) {
    console.error("Registration Error:", error.message);
    res.status(500).json({ message: "Server error during registration." });
  }
};

// ===============================
// LOGIN CONTROLLER (SUPABASE)
// ===============================
exports.loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Identifier and password are required." });
    }

    // Find user by code OR email
    const { data: users, error: findErr } = await supabase
      .from("tbl_users")
      .select("user_id, user_code, user_role, user_fn, user_ln, password")
      .or(`user_code.eq.${identifier},email.eq.${identifier}`)
      .limit(1);

    if (findErr) throw findErr;

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "User not found." });
    }

    const user = users[0];

    // DEBUG: Check stored password
    console.log("Supplied password:", password);
    console.log("Stored hash:", user.password);

    if (!user.password) {
      return res.status(500).json({ message: "Password not set or inaccessible (RLS issue?)" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        user_code: user.user_code,
        user_role: user.user_role,
        user_fn: user.user_fn,
        user_ln: user.user_ln,
      },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Login successful.",
      token,
      role: user.user_role,
      user_id: user.user_id,
      user_code: user.user_code,
      user_fn: user.user_fn,
      user_ln: user.user_ln,
      email: user.email
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: "Server error during login." });
  }
};
