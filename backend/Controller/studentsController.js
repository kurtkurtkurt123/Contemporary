const db = require("../config/mysql");
require("dotenv").config();

// =========================
// GET ALL STUDENTS
// =========================
const getStudents = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        user_id,
        user_code, 
        user_role, 
        user_fn, 
        user_ln, 
        email, 
        stud_course AS course,
        date_registered AS registeredDate
      FROM tbl_users
      WHERE user_role IN ('student', 'staff', 'uo_staff')
      ORDER BY date_registered DESC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Get Students Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


// =========================
// GET SINGLE STUDENT
// =========================
const getStudentById = async (req, res) => {
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
        stud_course AS course,
        date_registered AS registeredDate
      FROM tbl_users
      WHERE user_code = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(sql, [user_code]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    const s = rows[0];

    res.status(200).json({
      success: true,
      data: {
        id: s.user_code,
        name: `${s.user_fn} ${s.user_ln}`,
        course: s.course,
        email: s.email,
        registeredDate: s.registeredDate,
        role:
          s.user_role === "uo_staff"
            ? "Unofficial Staff"
            : s.user_role.charAt(0).toUpperCase() + s.user_role.slice(1)
      }
    });
  } catch (error) {
    console.error("❌ Error fetching student:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching student."
    });
  }
};

// =========================
// UPDATE ROLE
// =========================
const assignRole = async (req, res) => {
  try {
    const { user_code } = req.params;
    const { newRole } = req.body;

    const allowedRoles = ["student", "staff", "uo_staff"];

    if (!allowedRoles.includes(newRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role."
      });
    }

    const sql = `
      UPDATE tbl_users
      SET user_role = ?
      WHERE user_code = ?
    `;

    const [result] = await db.execute(sql, [newRole, user_code]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${user_code} updated to ${newRole}`
    });
  } catch (error) {
    console.error("❌ Error assigning role:", error);
    res.status(500).json({
      success: false,
      message: "Server error during role assignment."
    });
  }
};

// =========================
// DELETE STUDENT
// =========================
const deleteStudent = async (req, res) => {
  try {
    const { user_code } = req.params;

    const sql = `DELETE FROM tbl_users WHERE user_code = ?`;
    const [result] = await db.execute(sql, [user_code]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    res.status(200).json({
      success: true,
      message: `Student ${user_code} deleted successfully.`
    });
  } catch (error) {
    console.error("❌ Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting student."
    });
  }
};

module.exports = {
  getStudents,
  getStudentById,
  assignRole,
  deleteStudent
};
