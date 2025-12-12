const db = require("../config/supabase");
require("dotenv").config();

const STORAGE_URL =
  "https://vpegggmfmyzcqlswpngm.supabase.co/storage/v1/object/public/materials/";

// GET all tasks
const getTasks = async (req, res) => {
  try {
    const { data, error } = await db
      .from("tbl_tasks")
      .select(`
        task_id,
        task_code,
        date_submitted,
        status,
        comments,
        remarks,
        task_file,

        tbl_users!inner (
          user_fn,
          user_ln,
          stud_id,
          stud_course,
          user_role
        ),

        tbl_materials (
          item_name,
          item_grade,
          item_link
        )
      `)
      .in("tbl_users.user_role", ["student", "staff", "uo_staff"])
      .order("date_submitted", { ascending: false });

    if (error) throw error;

    const formattedData = data.map((row) => {
      const studentName = `${row.tbl_users.user_fn} ${row.tbl_users.user_ln}`;

      return {
        taskId: row.task_id,
        taskCode: row.task_code,
        dateSubmitted: row.date_submitted,
        status: row.status,
        comments: row.comments || "",
        remarks: row.remarks || null,
        courseSection: row.tbl_users.stud_course,
        studentId: row.tbl_users.stud_id,
        studentName,
        materialFileName: row.tbl_materials?.item_name || null,
        materialFileUrl: row.tbl_materials?.item_link
          ? `${STORAGE_URL}${row.tbl_materials.item_link}`
          : null,

        submittedFile: row.task_file
          ? `${STORAGE_URL}${row.task_file}`
          : null,

        maxScore: row.tbl_materials?.item_grade || null,
      };
    });

    res.json({ success: true, data: formattedData });
  } catch (error) {
    console.error("GET TASKS ERROR:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error while fetching tasks." });
  }
};

// GET task by ID
const getTaskById = async (req, res) => {
  const { task_id } = req.params;

  try {
    const { data, error } = await db
      .from("tbl_tasks")
      .select(`
        task_id,
        task_code,
        comments,
        remarks,
        task_file,
        status,
        date_submitted,
        
        tbl_users (
          user_fn,
          user_ln,
          stud_id,
          stud_course
        ),

        tbl_materials (
          item_name,
          item_grade,
          item_file
        )
      `)
      .eq("task_id", task_id);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(404).json({ success: false, message: "Task not found." });
    }

    const taskData = data[0];

    // --- FIX: Handle if joined data is returned as an Array or an Object ---
    
    // 1. Safely extract Material Data
    const rawMaterial = taskData.tbl_materials;
    const materialData = Array.isArray(rawMaterial) ? rawMaterial[0] : rawMaterial;

    // 2. Safely extract User Data
    const rawUser = taskData.tbl_users;
    const userData = Array.isArray(rawUser) ? rawUser[0] : rawUser;

    const formatted = {
      task_id: taskData.task_id,
      task_code: taskData.task_code, // Added this back as it's often useful
      status: taskData.status,
      dateSubmitted: taskData.date_submitted,
      
      // User Details
      studentName: `${userData?.user_fn || ""} ${userData?.user_ln || ""}`.trim(),
      studentId: userData?.stud_id || null,
      course: userData?.stud_course || null,

      // Task Feedback
      remarks: taskData.remarks ?? null,
      comments: taskData.comments || "",

      // Material Details (using the safely extracted variable)
      maxScore: materialData?.item_grade ?? null,
      materialFileName: materialData?.item_name || null,
      materialFileUrl: materialData?.item_link
        ? `${STORAGE_URL}${materialData.item_link}`
        : null,

      // Submitted File
      submittedFile: taskData.task_file 
        ? `${STORAGE_URL}${taskData.task_file}` 
        : null,
    };

    return res.json({ success: true, data: formatted });

  } catch (err) {
    console.error("GET TASK BY ID ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error fetching task." });
  }
};

// UPDATE task remarks (score)
const updateTaskRemarks = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { comments, remarks, status } = req.body;
    const file = req.file;

    if (!task_id) {
      return res
        .status(400)
        .json({ success: false, message: "Task ID is required." });
    }

    const { data: taskData } = await db
      .from("tbl_tasks")
      .select("task_id, item_id")
      .eq("task_id", task_id)
      .single();

    if (!taskData) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found." });
    }

    let maxScore = null;

    if (taskData.item_id) {
      const { data: materialData } = await db
        .from("tbl_materials")
        .select("item_grade")
        .eq("item_id", taskData.item_id)
        .single();

      if (materialData) maxScore = Number(materialData.item_grade);
    }

    if (remarks !== undefined && maxScore !== null) {
      if (isNaN(remarks) || Number(remarks) < 0) {
        return res.status(400).json({
          success: false,
          message: "Remarks must be a positive number.",
        });
      }

      if (Number(remarks) > maxScore) {
        return res.status(400).json({
          success: false,
          message: `Remarks cannot exceed maximum score (${maxScore}).`,
        });
      }
    }

    let filePath = null;

    if (file) {
      const uniqueName = `TASK-${task_id}-${Date.now()}.pdf`;
      filePath = uniqueName;

      const { error: uploadErr } = await db.storage
        .from("materials")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: true,
        });

      if (uploadErr) {
        return res
          .status(500)
          .json({ success: false, message: "File upload failed." });
      }
    }

    const updateFields = {};
    if (comments !== undefined) updateFields.comments = comments;
    if (remarks !== undefined) updateFields.remarks = Number(remarks);
    if (status !== undefined) updateFields.status = status;
    if (filePath) updateFields.task_file = filePath;

    const { error } = await db
      .from("tbl_tasks")
      .update(updateFields)
      .eq("task_id", task_id);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    return res.json({
      success: true,
      message: "Task updated successfully.",
      maxScore,
      updated: updateFields,
    });
  } catch (err) {
    console.error("SERVER ERROR UPDATING TASK:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error updating task." });
  }
};

module.exports = { getTasks, getTaskById, updateTaskRemarks };
