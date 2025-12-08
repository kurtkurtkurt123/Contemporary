const express = require("express");
const router = express.Router();
const { getStudents, getStudentById, assignRole, deleteStudent } = require("../Controller/studentsController");

// Routes
router.get("/get", getStudents);                // GET all students
router.get("/:user_code", getStudentById);      // GET single student
router.patch("/assign/:user_code", assignRole); // PATCH role
router.delete("/delete/:user_code", deleteStudent); // DELETE student

module.exports = router;
