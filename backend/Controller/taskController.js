const db = require("../config/mysql");
require("dotenv").config();

const getTasks = async (req, res) => {
  try {
    const sql = `
      SELECT 
        t.task_id AS taskId,
        t.task_code AS taskCode,
        u.stud_id AS studentId,
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
const getTaskById = async (req, res) => {
  const { task_id } = req.params;

  if (!task_id) {
    return res.status(400).json({ success: false, message: "Task ID is required." });
  }

  try {
    const sql = `
      SELECT 
        t.task_id,
        t.task_code,
        m.item_name AS task_name,
        t.task_desc,
        t.task_link,
        t.status,
        t.remarks,
        t.date_submitted,
        t.is_link,
        m.item_grade,
        m.item_link,
        CONCAT(u.user_fn, ' ', u.user_ln) AS studentName,
        u.stud_id AS studentId,
        u.stud_course AS courseSection,
        m.item_name AS taskSubmitted,
        m.item_link AS taskLink
      FROM tbl_tasks t
      LEFT JOIN tbl_users u ON t.user_id = u.user_id
      LEFT JOIN tbl_materials m ON t.item_id = m.item_id
      WHERE t.task_id = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(sql, [task_id]);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


const updateTaskRemarks = async (req, res) => {
  const { task_id } = req.params;
  const { remarks } = req.body;

  if (!task_id) {
    return res.status(400).json({ success: false, message: "Task ID is required." });
  }

  try {
    const sql = `
      UPDATE tbl_tasks
      SET remarks = ?
      WHERE task_id = ?
    `;
    const [result] = await db.execute(sql, [remarks, task_id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Task not found or nothing to update." });
    }

    res.json({ success: true, message: "Remarks updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { getTasks, getTaskById, updateTaskRemarks };


