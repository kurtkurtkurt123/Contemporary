const db = require("../config/mysql");
require("dotenv").config();

// Fetch all students (with optional course filter)
exports.getStudents = async (req, res) => {
  try {
    const { course } = req.query;

    let sql = `
      SELECT 
        user_id,
        user_code, 
        user_role, 
        user_fn, 
        user_ln, 
        email, 
        stud_course,
        created_at AS registeredDate
      FROM tbl_users
      WHERE user_role IN ('student', 'staff', 'uo_staff')
    `;
    const params = [];

    if (course && course !== 'All') {
      sql += ' AND stud_course = ?';
      params.push(course);
    }

    const [students] = await db.execute(sql, params);
    res.status(200).json({ success: true, data: students });

  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server error while fetching students." });
  }
};

// Get single student by user_code
exports.getStudentById = async (req, res) => {
  try {
    const { user_code } = req.params;

    const sql = `
      SELECT 
        user_id,
        user_code, 
        user_role, 
        user_fn, 
        user_ln, 
        email, 
        stud_course,
        created_at AS registeredDate
      FROM tbl_users
      WHERE user_code = ?
      LIMIT 1
    `;
    const [rows] = await db.execute(sql, [user_code]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(rows[0]);

  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({ message: 'Server error while fetching student' });
  }
};

// Assign role (student → staff)
exports.assignRole = async (req, res) => {
  try {
    const { user_code } = req.params;
    const { newRole } = req.body;

    if (!['staff', 'student'].includes(newRole)) {
      return res.status(400).json({ message: "Invalid role. Only 'staff' or 'student' allowed." });
    }

    const sql = `
      UPDATE tbl_users
      SET user_role = ?
      WHERE user_code = ? AND user_role IN ('student', 'uo_staff')
    `;

    const [result] = await db.execute(sql, [newRole, user_code]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or role not eligible for change." });
    }

    res.status(200).json({ message: `User ${user_code} updated to ${newRole}` });

  } catch (error) {
    console.error("Error assigning role:", error);
    res.status(500).json({ message: "Server error during role assignment." });
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  try {
    const { user_code } = req.params;

    const sql = `DELETE FROM tbl_users WHERE user_code = ?`;
    const [result] = await db.execute(sql, [user_code]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: `Student ${user_code} deleted successfully.` });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Server error while deleting student' });
  }
};
