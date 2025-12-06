// backend/routes/student.js
const express = require('express');
const router = express.Router();
const db = require("../config/mysql.js"); // MySQL Connection
const { protect } = require("../Middleware/authmiddleware"); // Security Middleware

// Dito ilalagay ang Student-specific API endpoints
// Halimbawa: GET enrolled courses ng student
router.get('/enrollments/:userId', protect(['Student']), async (req, res) => {
    const userId = req.params.userId;

    // SECURITY CHECK: Dapat sarili lang niyang data ang kinukuha (Highly Recommended!)
    if (req.user.UserID !== parseInt(userId)) {
        return res.status(403).json({ message: "Unauthorized access to another student's data." });
    }

    try {
        // SQL Query: Kumuha ng Courses na naka-enroll ang user
        const sql = `
            SELECT c.CourseID, c.Title, c.Code, e.EnrollmentDate, e.FinalGrade 
            FROM Courses c
            JOIN Enrollments e ON c.CourseID = e.CourseID
            WHERE e.UserID = ?
        `;
        
        const [rows] = await db.execute(sql, [userId]);
        res.json(rows);
    } catch (err) {
        console.error("Student Enrollments Error:", err);
        res.status(500).json({ message: 'Server error fetching enrollments.' });
    }
});


module.exports = router;