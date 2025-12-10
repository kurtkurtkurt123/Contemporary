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

  } catch (error) {
    console.error("Get Students Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// =====================================================
// GET SINGLE STUDENT
// =====================================================
const getStudentById = async (req, res) => {
  try {
    const { user_code } = req.params;

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

    res.status(200).json({
      success: true,
      data: {
        id: s.user_code,
        name: `${s.user_fn} ${s.user_ln}`,
        email: s.email,
        course: s.stud_course,
        registeredDate: s.date_registered,
        role: formatRole(s.user_role)
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

// =====================================================
// UPDATE ROLE
// =====================================================
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

    const { error } = await db
      .from("tbl_users")
      .update({ user_role: newRole })
      .eq("user_code", user_code);

    if (error) throw error;

    res.status(200).json({
      success: true,
      message: `User role updated to ${formatRole(newRole)}.`
    });

  } catch (error) {
    console.error("❌ Error assigning role:", error);
    res.status(500).json({
      success: false,
      message: "Server error during role assignment."
    });
  }
};

// =====================================================
// DELETE STUDENT
// =====================================================
const deleteStudent = async (req, res) => {
  try {
    const { user_code } = req.params;

    const { error } = await db
      .from("tbl_users")
      .delete()
      .eq("user_code", user_code);

    if (error) throw error;

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
