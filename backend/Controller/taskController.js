const db = require("../config/supabase");
require("dotenv").config();

const getTasks = async (req, res) => {
  try {
    // Note: This query assumes you have foreign key relationships set up in Supabase
    // between tbl_tasks.user_id -> tbl_users.user_id and tbl_tasks.item_id -> tbl_materials.item_id.
    const { data, error } = await db
      .from("tbl_tasks")
      .select(
        `
        taskId:task_id,
        taskCode:task_code,
        dateSubmitted:date_submitted,
        status,
        remarks,
        tbl_users!inner(user_fn, user_ln, studentId:stud_id, courseSection:stud_course, user_role),
        tbl_materials(taskSubmitted:item_name)
      `
      )
      .in("tbl_users.user_role", ["student", "staff", "uo_staff"])
      .order("date_submitted", { ascending: false });

    if (error) throw error;

    // Format data to match the original query's output (e.g., concatenate name)
    const formattedData = data.map((task) => ({
      ...task,
      studentName: `${task.tbl_users.user_fn} ${task.tbl_users.user_ln}`,
      ...task.tbl_users,
      ...task.tbl_materials,
      tbl_users: undefined, // Clean up nested objects
      tbl_materials: undefined,
    }));

    res.json({ success: true, data: formattedData });
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
    const { data, error } = await db
      .from("tbl_tasks")
      .select(
        `
        task_id, task_code, task_desc, task_link, status, remarks, date_submitted, is_link,
        tbl_users(user_fn, user_ln, studentId:stud_id, courseSection:stud_course),
        tbl_materials(task_name:item_name, item_grade, taskLink:item_link)
      `
      )
      .eq("task_id", task_id)
      .single(); // .single() is perfect for fetching one record

    if (error) {
      if (error.code === "PGRST116") { // PostgREST code for "exact one row not found"
        return res.status(404).json({ success: false, message: "Task not found." });
      }
      throw error;
    }

    // Format data to match the original query's flat structure
    const formattedData = {
      ...data,
      studentName: `${data.tbl_users.user_fn} ${data.tbl_users.user_ln}`,
      taskSubmitted: data.tbl_materials.task_name, // Alias from original query
      ...data.tbl_users,
      ...data.tbl_materials,
      tbl_users: undefined,
      tbl_materials: undefined,
    };

    res.json({ success: true, data: formattedData });
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
    const { error, count } = await db
      .from("tbl_tasks")
      .update({ remarks: remarks })
      .eq("task_id", task_id)
      .select('*', { count: 'exact' }); // count helps verify a row was updated

    if (error) throw error;
    if (count === 0) {
      return res.status(404).json({ success: false, message: "Task not found or nothing to update." });
    }

    res.json({ success: true, message: "Remarks updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

module.exports = { getTasks, getTaskById, updateTaskRemarks };
