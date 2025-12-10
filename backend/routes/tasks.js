const express = require("express");
const router = express.Router();
const { getTasks, getTaskById, updateTaskRemarks } = require("../Controller/taskController");

router.get("/get", getTasks);
router.get("/:task_id", getTaskById);
router.put("/score/:task_id", updateTaskRemarks);

module.exports = router;