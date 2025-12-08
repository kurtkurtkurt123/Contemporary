const express = require("express");
const router = express.Router();

const { getStudents, assignRole } = require("../Controller/studentsController");

router.get("/list", getStudents);
router.patch("/assign/:user_code", assignRole);

module.exports = router;

