<<<<<<< HEAD
const db = require("../config/mysql");

// Save Material
const createMaterial = async (req, res) => {
    try {
        const {
            name,
            type,
            description,
            deadline,
            score,
            noScore,
            link
        } = req.body;

        const itemGrade = noScore
            ? 0
            : score === "" || score === undefined
                ? null
                : score; // convert string to number


        const is_link = type === "Link" ? 1 : 0;

        // File buffer (only for File type)
        const uploadedFile = !is_link && req.file ? req.file.buffer : null;

        // Link (only for Link type)
        const materialLink = is_link ? link : null;

        const sql = `
            INSERT INTO tbl_materials (
                item_code,
                item_name,
                item_desc,
                item_file,
                item_link,
                item_type,
                item_grade,
                date_deadline,
                is_link,
                is_accept
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            "MAT-" + Date.now(), // item_code
            name,                // item_name
            description,         // item_desc
            uploadedFile,        // item_file
            materialLink,        // item_link
            type,                // item_type: "File" or "Link"
            itemGrade,           // item_grade
            deadline || null,    // date_deadline
            is_link,             // is_link
            1                    // is_accept
        ];

        await db.execute(sql, values);

        res.json({ success: true, message: "Material saved successfully!" });
    } catch (error) {
        console.error("Create Material Error:", error);
        res.status(500).json({ success: false, message: "Server error." });
    }
};

// Get all materials
const getMaterials = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        item_code, 
        item_name, 
        item_desc AS item_description, 
        item_type, 
        date_uploaded, 
        date_deadline,
        item_grade
      FROM tbl_materials
      ORDER BY date_uploaded DESC
    `);

    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Get Materials Error:", error);
=======
const supabase = require("../config/supabase"); // <- uses service role key
const { v4: uuidv4 } = require("uuid");

// -----------------------------------------------------
// CREATE MATERIAL (Metadata + File Upload)
// -----------------------------------------------------
const createMaterial = async (req, res) => {
  try {
    const { name, description, deadline, score, noScore, fileUrl } = req.body;

    // Validate required fields
    if (!name || !fileUrl) {
      return res.status(400).json({ success: false, message: "Name and file are required." });
    }

    const item_code = `MAT-${Date.now()}`;

    // Ensure proper score value
    const itemScore = noScore || !score ? 0 : Number(score);

    // Insert record into Supabase
    const { error } = await supabase
      .from("tbl_materials")
      .insert([{
        item_code,
        item_name: name,
        item_desc: description || null,
        date_deadline: deadline ? deadline : null, // send null if empty
        item_grade: itemScore,
        is_accept: noScore ? false : true,
        item_type: "File",
        item_file: fileUrl,
        is_link: false,
      }]);

    if (error) throw error;

    res.json({
      success: true,
      id: item_code,
      message: "Material created successfully."
    });

  } catch (err) {
    console.error("CREATE MATERIAL ERROR:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


// -----------------------------------------------------
// GET ALL MATERIALS
// -----------------------------------------------------
const getMaterials = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("tbl_materials")
      .select(
        "item_code, item_name, item_desc, item_type, date_uploaded, date_deadline, item_grade"
      )
      .order("date_uploaded", { ascending: false });

    if (error) throw error;

    res.json({ success: true, data });
  } catch (err) {
    console.error("GET MATERIALS ERROR:", err);
>>>>>>> test/supabase-migration
    res.status(500).json({ success: false, message: "Server error." });
  }
};

<<<<<<< HEAD
const updateMaterial = async (req, res) => {
  try {
    const { item_code } = req.params; // material ID to update
    const {
      name,
      type,
      description,
      grade,
      accept,  // boolean 1 or 0
      link
    } = req.body;

    const is_link = type === "Link" ? 1 : 0;

    // File buffer (only for File type)
    const uploadedFile = !is_link && req.file ? req.file.buffer : null;

    const sql = `
      UPDATE tbl_materials
      SET
        item_name = ?,
        item_desc = ?,
        item_type = ?,
        item_grade = ?,
        is_accept = ?,
        is_link = ?,
        item_file = ?,
        item_link = ?
      WHERE item_code = ?
    `;

    const values = [
      name,
      description,
      type,
      grade,
      accept,
      is_link,
      uploadedFile, // can be null if no new file uploaded
      link || null,
      item_code
    ];

    const [result] = await db.execute(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Material not found." });
    }

    res.json({ success: true, message: "Material updated successfully." });
  } catch (error) {
    console.error("Update Material Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Get single material by ID
// Get single material by ID
const getMaterialById = async (req, res) => {
  try {
    const { item_code } = req.params;
    const [rows] = await db.execute(`
      SELECT 
        item_code,
        item_name,
        item_desc AS item_description,
        item_type,
        item_grade,
        is_accept,
        is_link,
        item_file,
        item_link,
        date_uploaded,
        date_deadline
      FROM tbl_materials
      WHERE item_code = ?
      LIMIT 1
    `, [item_code]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Material not found." });
    }

    // We don't need to send the file buffer here anymore.
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error("Get Material By ID Error:", error);
=======
// -----------------------------------------------------
// GET MATERIAL BY ID
// -----------------------------------------------------
const getMaterialById = async (req, res) => {
  try {
    const { item_code } = req.params;

    const { data, error } = await supabase
      .from("tbl_materials")
      .select("*")
      .eq("item_code", item_code)
      .single();

    if (error) throw error;

    if (!data) return res.status(404).json({ success: false, message: "Not found" });

    // Generate public URL if exists
    let fileUrl = data.item_file;
    if (fileUrl && !fileUrl.startsWith("http")) {
      const { data: publicData } = supabase.storage
        .from("materials")
        .getPublicUrl(data.item_file);
      fileUrl = publicData.publicUrl;
    }

    res.json({ success: true, data: { ...data, fileUrl } });

  } catch (err) {
    console.error("GET MATERIAL BY ID ERROR:", err);
>>>>>>> test/supabase-migration
    res.status(500).json({ success: false, message: "Server error." });
  }
};

<<<<<<< HEAD


// Delete material by ID
=======
// -----------------------------------------------------
// UPDATE MATERIAL (Metadata + Optional File)
// -----------------------------------------------------
const updateMaterial = async (req, res) => {
  try {
    const { item_code } = req.params;
    const { name, description, deadline, grade, accept } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required." });
    }

    // Fetch existing record
    const { data: existing, error: fetchErr } = await supabase
      .from("tbl_materials")
      .select("item_file")
      .eq("item_code", item_code)
      .single();

    if (fetchErr) throw fetchErr;

    let newFilePath = existing?.item_file || null;

    // If a new file is uploaded
    if (req.file) {
      const ext = req.file.originalname.split(".").pop();
      newFilePath = `${item_code}/${uuidv4()}.${ext}`;

      // Delete old file if exists (handle URLs like deleteMaterial)
      if (existing?.item_file) {
        let relativePath = existing.item_file;

        if (relativePath.startsWith("http")) {
          const parts = relativePath.split("/materials/");
          if (parts.length === 2) {
            relativePath = parts[1];
          } else {
            console.error("Invalid file URL format:", relativePath);
            return res.status(400).json({ success: false, message: "Invalid existing file URL" });
          }
        }

        const { error: storageErr } = await supabase.storage
          .from("materials")
          .remove([relativePath]);

        if (storageErr) {
          console.error("Failed to delete existing file:", storageErr);
          return res.status(500).json({ success: false, message: "Failed to delete old file from storage." });
        }
      }

      // Upload new file
      const { error: uploadErr } = await supabase.storage
        .from("materials")
        .upload(newFilePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadErr) throw uploadErr;
    }

    // Update DB
    const { error } = await supabase
      .from("tbl_materials")
      .update({
        item_name: name,
        item_desc: description || null,
        date_deadline: deadline ? deadline : null,
        item_grade: grade ? Number(grade) : 0,
        is_accept: typeof accept !== "undefined" ? accept : true,
        item_file: newFilePath,
      })
      .eq("item_code", item_code);

    if (error) throw error;

    res.json({ success: true, message: "Material updated successfully." });

  } catch (err) {
    console.error("UPDATE MATERIAL ERROR:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// -----------------------------------------------------
// DELETE MATERIAL + FILE
// -----------------------------------------------------
>>>>>>> test/supabase-migration
const deleteMaterial = async (req, res) => {
  try {
    const { item_code } = req.params;

<<<<<<< HEAD
    const [result] = await db.execute(`DELETE FROM tbl_materials WHERE item_code = ?`, [item_code]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Material not found." });
    }

    res.json({ success: true, message: "Material deleted successfully." });
  } catch (error) {
    console.error("Delete Material Error:", error);
=======
    // 1. Fetch file path from DB
    const { data: material, error: fetchErr } = await supabase
      .from("tbl_materials")
      .select("item_file")
      .eq("item_code", item_code)
      .single();

    if (fetchErr) throw fetchErr;

    // 2. Delete file from storage if it exists
    if (material?.item_file) {
      let relativePath = material.item_file;

      // If stored as a public URL, extract relative path
      if (relativePath.startsWith("http")) {
        // Assumes bucket name is "materials"
        const parts = relativePath.split("/materials/");
        if (parts.length === 2) {
          relativePath = parts[1];
        } else {
          console.error("Invalid file URL format:", relativePath);
          return res.status(400).json({ success: false, message: "Invalid file URL" });
        }
      }

      const { error: storageErr } = await supabase.storage
        .from("materials")
        .remove([relativePath]);

      if (storageErr) {
        console.error("Storage delete error:", storageErr);
        return res.status(500).json({ success: false, message: "Failed to delete file from storage." });
      }
    }

    // 3. Delete database record
    const { error: dbErr } = await supabase
      .from("tbl_materials")
      .delete()
      .eq("item_code", item_code);

    if (dbErr) throw dbErr;

    res.json({ success: true, message: "Material and file deleted successfully." });

  } catch (err) {
    console.error("DELETE MATERIAL ERROR:", err);
>>>>>>> test/supabase-migration
    res.status(500).json({ success: false, message: "Server error." });
  }
};


<<<<<<< HEAD
// routes/materialRoutes.js or app.js (where your routes are defined


module.exports = {
  createMaterial,
  getMaterials,
  updateMaterial,
  getMaterialById,
  deleteMaterial
};
=======
module.exports = {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial
};
>>>>>>> test/supabase-migration
