const db = require("../config/mysql");
require("dotenv").config();

exports.getStudents = async (req, res) => {
    try {
        // ✨ Use req.query to get optional filters from the URL
        const { course } = req.query;

        let sql = `
            SELECT 
                user_id,
                user_code, 
                user_role, 
                user_fn, 
                user_ln, 
                email, 
                stud_course 
            FROM tbl_users
            WHERE user_role = 'student' 
        `;
        const params = [];

        // If a course is provided in the query, add it to the SQL statement
        if (course) {
            sql += ' AND stud_course = ?';
            params.push(course);
        }

        const [students] = await db.execute(sql, params);
        res.status(200).json(students);

    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Server error while fetching students." });
    }
};

exports.assignRole = async (req, res) => {
  try {
    const { user_code } = req.params; // Get user_code from URL parameter
    const { newRole } = req.body; // Get the new role from the request body

    // 1. Validate the new role. For now, we only allow assigning to 'staff'.
    if (newRole !== 'staff') {
      return res.status(400).json({ message: "Invalid role assignment. Only 'staff' is allowed." });
    }

    // 2. Define the SQL query to update the user's role.
    // This query targets a user by their user_code and ensures they are currently a 'student' or 'uo_staff'.
    const sql = `
            UPDATE tbl_users 
            SET user_role = ? 
            WHERE user_code = ? AND (user_role = 'student' OR user_role = 'uo_staff')
        `;

    // 3. Execute the query
    const [result] = await db.execute(sql, [newRole, user_code]);

    // 4. Check if any row was actually updated.
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or not eligible for role change." });
    }

    res.status(200).json({ message: `User ${user_code} has been successfully assigned as ${newRole}.` });

  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).json({ message: "Server error during role assignment." });
  }
};
