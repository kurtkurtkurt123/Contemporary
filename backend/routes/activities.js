const express = require("express");
const router = express.Router();
const { getActivities, createActivity } = require("../Controller/activityController");

// GET /api/activities - fetch all activities
router.get('/:student_id', getActivities);
router.post('/create', createActivity);
module.exports = router;
