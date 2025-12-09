const express = require("express");
const router = express.Router();
const { getTasks } = require("../Controller/taskController");

router.get("/get", getTasks);

module.exports = router;