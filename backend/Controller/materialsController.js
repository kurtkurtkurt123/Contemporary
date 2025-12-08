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
    res.status(500).json({ success: false, message: "Server error." });
  }
};

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
    res.status(500).json({ success: false, message: "Server error." });
  }
};



// Delete material by ID
const deleteMaterial = async (req, res) => {
  try {
    const { item_code } = req.params;

    const [result] = await db.execute(`DELETE FROM tbl_materials WHERE item_code = ?`, [item_code]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: "Material not found." });
    }

    res.json({ success: true, message: "Material deleted successfully." });
  } catch (error) {
    console.error("Delete Material Error:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


// routes/materialRoutes.js or app.js (where your routes are defined


module.exports = {
  createMaterial,
  getMaterials,
  updateMaterial,
  getMaterialById,
  deleteMaterial
};