<<<<<<< HEAD
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
=======
const db = require("../config/supabase");
require("dotenv").config();

// -----------------------------------------------------
// Helper to format role for frontend
// -----------------------------------------------------
function formatRole(dbRole) {
  if (!dbRole) return "";
  if (dbRole === "uo_staff") return "UO Staff";
  if (dbRole === "staff") return "Staff";
  if (dbRole === "student") return "Student";
  return dbRole.charAt(0).toUpperCase() + dbRole.slice(1);
}

// =====================================================
// GET ALL STUDENTS
// =====================================================
const getStudents = async (req, res) => {
  try {
    const { data, error } = await db
      .from("tbl_users")
      .select(`
        user_id,
        user_code,
        user_role,
        user_fn,
        user_ln,
        email,
        stud_course,
        date_registered
      `)
      .in("user_role", ["student", "staff", "uo_staff"])
      .order("date_registered", { ascending: false });

    if (error) throw error;

    const mappedData = data.map(s => ({
      id: s.user_code,
      name: `${s.user_fn} ${s.user_ln}`,
      email: s.email,
      course: s.stud_course,
      registeredDate: s.date_registered,
      role: formatRole(s.user_role)
    }));

    res.json({ success: true, data: mappedData });

>>>>>>> test/supabase-migration
  } catch (error) {
    console.error("Get Students Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

<<<<<<< HEAD

// =========================
// GET SINGLE STUDENT
// =========================
=======
// =====================================================
// GET SINGLE STUDENT
// =====================================================
>>>>>>> test/supabase-migration
const getStudentById = async (req, res) => {
  try {
    const { user_code } = req.params;

<<<<<<< HEAD
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

=======
    const { data: s, error } = await db
      .from("tbl_users")
      .select(`
        user_id,
        user_code,
        user_role,
        user_fn,
        user_ln,
        email,
        stud_course,
        date_registered
      `)
      .eq("user_code", user_code)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Student not found."
        });
      }
      throw error;
    }

>>>>>>> test/supabase-migration
    res.status(200).json({
      success: true,
      data: {
        id: s.user_code,
        name: `${s.user_fn} ${s.user_ln}`,
<<<<<<< HEAD
        course: s.course,
        email: s.email,
        registeredDate: s.registeredDate,
        role:
          s.user_role === "uo_staff"
            ? "Unofficial Staff"
            : s.user_role.charAt(0).toUpperCase() + s.user_role.slice(1)
      }
    });
=======
        email: s.email,
        course: s.stud_course,
        registeredDate: s.date_registered,
        role: formatRole(s.user_role)
      }
    });

>>>>>>> test/supabase-migration
  } catch (error) {
    console.error("❌ Error fetching student:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching student."
    });
  }
};

<<<<<<< HEAD
// =========================
// UPDATE ROLE
// =========================
=======
// =====================================================
// UPDATE ROLE
// =====================================================
>>>>>>> test/supabase-migration
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

<<<<<<< HEAD
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
=======
    const { error } = await db
      .from("tbl_users")
      .update({ user_role: newRole })
      .eq("user_code", user_code);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: `User role updated to ${formatRole(newRole)}.`
    });

>>>>>>> test/supabase-migration
  } catch (error) {
    console.error("❌ Error assigning role:", error);
    res.status(500).json({
      success: false,
      message: "Server error during role assignment."
    });
  }
};

<<<<<<< HEAD
// =========================
// DELETE STUDENT
// =========================
=======
// =====================================================
// DELETE STUDENT
// =====================================================
>>>>>>> test/supabase-migration
const deleteStudent = async (req, res) => {
  try {
    const { user_code } = req.params;

<<<<<<< HEAD
    const sql = `DELETE FROM tbl_users WHERE user_code = ?`;
    const [result] = await db.execute(sql, [user_code]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }
=======
    const { error } = await db
      .from("tbl_users")
      .delete()
      .eq("user_code", user_code);

    if (error) throw error;
>>>>>>> test/supabase-migration

    res.status(200).json({
      success: true,
      message: `Student ${user_code} deleted successfully.`
    });
<<<<<<< HEAD
=======

>>>>>>> test/supabase-migration
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
