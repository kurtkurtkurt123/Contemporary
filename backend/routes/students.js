const express = require("express");
const router = express.Router();
const {
  getStudents,
  getStudentById,
  assignRole,
  deleteStudent
} = require("../Controller/studentsController");

// =========================
// GET ALL STUDENTS
// Optional query: ?course=COURSE_NAME
// =========================
router.get("/get", getStudents);

// =========================
// GET SINGLE STUDENT BY CODE
// =========================
router.get("/:user_code", getStudentById);

// =========================
// ASSIGN ROLE TO STUDENT
// PATCH body: { newRole: "staff" | "student" | "uo_staff" }
// =========================
router.patch("/assign/:user_code", assignRole);

// =========================
// DELETE STUDENT
// =========================
router.delete("/delete/:user_code", deleteStudent);

module.exports = router;
