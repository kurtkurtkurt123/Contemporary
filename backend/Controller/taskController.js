const db = require("../config/mysql");
require("dotenv").config();

const getTasks = async (req, res) => {
  try {
    const sql = `
      SELECT 
        t.task_code AS taskCode,
        CONCAT(u.user_fn, ' ', u.user_ln) AS studentName,
        u.stud_course AS courseSection,
        m.item_name AS taskSubmitted,
        t.date_submitted AS dateSubmitted,
        t.status AS status,
        t.remarks AS remarks
      FROM tbl_tasks t
      LEFT JOIN tbl_users u ON t.user_id = u.user_id
      LEFT JOIN tbl_materials m ON t.item_id = m.item_id
      WHERE u.user_role IN ('student', 'staff', 'uo_staff')
      ORDER BY t.date_submitted DESC
    `;

    const [rows] = await db.execute(sql);

    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { getTasks };


