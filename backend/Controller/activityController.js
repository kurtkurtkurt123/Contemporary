const supabase = require("../config/supabase");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

// GET ACTIVITIES
const getActivities = async (req, res) => {
  try {
    const { student_id } = req.query;
    if (!student_id) return res.status(400).json({ success: false, message: "student_id is required." });

    // Fetch materials
    const { data: materials, error: matError } = await supabase
      .from("tbl_materials")
      .select(`item_code, item_name, item_desc, item_type, date_uploaded, date_deadline, item_grade, item_file, is_accept`)
      .order("date_uploaded", { ascending: false });
    if (matError) throw matError;

    // Fetch student tasks
    const { data: tasks, error: taskError } = await supabase
      .from("tbl_tasks")
      .select(`task_id, task_code, task_file, status, date_submitted, remarks, user_id, task_name`)
      .eq("user_id", student_id);
    if (taskError) throw taskError;

    const taskMap = {};
    tasks.forEach(t => {
      // Map by material code (task_name or item_id)
      taskMap[t.task_name] = t;
    });

    const activities = materials.map(item => {
      const submission = taskMap[item.item_name] || null;
      const now = new Date();
      const deadline = item.date_deadline ? new Date(item.date_deadline) : null;

      let status = "Pending";
      let statusColor = "text-yellow-400";

      if (!submission && deadline && now > deadline) {
        status = "Empty (Missed)";
        statusColor = "text-red-400";
      } else if (submission) {
        const submittedDate = submission.date_submitted ? new Date(submission.date_submitted) : null;

        if (deadline && submittedDate && submittedDate > deadline && item.is_accept) {
          status = "Submitted Late";
          statusColor = "text-orange-400";
        } else {
          status = "Submitted";
          statusColor = "text-green-400";
        }
      }

      let fileUrl = null;
      if (item.item_file) {
        const { data: urlData } = supabase.storage.from("materials").getPublicUrl(item.item_file);
        fileUrl = urlData.publicUrl;
      }

      return {
        id: item.item_code,
        title: item.item_name,
        description: item.item_desc,
        type: item.item_type,
        postedDate: item.date_uploaded ? new Date(item.date_uploaded).toLocaleString("en-PH", { timeZone: "Asia/Manila", year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true }) : null,
        dueDate: item.date_deadline ? new Date(item.date_deadline).toLocaleString("en-PH", { timeZone: "Asia/Manila", year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true }) : null,
        status,
        statusColor,
        score: submission?.remarks || null,
        submittedFile: submission?.task_file || null,
        submittedDate: submission?.date_submitted || null,
        fileUrl,
        filePath: item.item_file || null,
        is_accept: item.is_accept || false
      };
    });

    return res.status(200).json({ success: true, data: activities });

  } catch (err) {
    console.error("GET ACTIVITIES ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error while fetching activities." });
  }
};

// CREATE ACTIVITY (already fixed)
const createActivity = async (req, res) => {
  try {
    const { material_id, user_id, task_name, comments, task_file } = req.body;

    if (!material_id || !user_id || !task_name || !task_file) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Fetch material
    const { data: materialData, error: matError } = await supabase
      .from("tbl_materials")
      .select("item_code, date_deadline, is_accept")
      .eq("item_code", material_id)
      .single();

    if (matError || !materialData) {
      return res.status(404).json({ success: false, message: "Material not found." });
    }

    // Determine status based on deadline and is_accept
    const now = new Date();
    let status = "ontime"; // default value that matches table constraint
    if (materialData.date_deadline) {
      const deadline = new Date(materialData.date_deadline);
      if (now > deadline) {
        status = materialData.is_accept ? "late" : "ontime";
      }
    }

    // Generate random task code
    const task_code = `TSK-${uuidv4().split("-")[0]}`;

    // Insert task
    const { error } = await supabase
      .from("tbl_tasks")
      .insert([{
        task_code,
        user_id,
        task_name,
        comments: comments || null, // changed from task_desc
        task_file,
        status
      }]);

    if (error) throw error;

    return res.status(200).json({ 
      success: true, 
      message: "Task submitted successfully.", 
      task_code, 
      status 
    });

  } catch (err) {
    console.error("CREATE ACTIVITY ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error during task submission." });
  }
};


module.exports = { getActivities, createActivity };
