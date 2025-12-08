const express = require("express");
const multer = require("multer");
const db = require("../config/mysql"); // <-- Import 'db'
const { 
  createMaterial, 
  getMaterials, 
  updateMaterial, 
  getMaterialById,
  deleteMaterial
} = require("../Controller/materialsController.js");

const router = express.Router();

// Multer setup (store uploaded file in RAM)
const upload = multer({ storage: multer.memoryStorage() });

// POST: Create Material
router.post("/create", upload.single("file"), createMaterial);

// GET: Get all materials
router.get("/get", getMaterials);

// GET: Get single material by ID
router.get("/:item_code", getMaterialById);

// DELETE: Delete material by ID
router.delete("/:item_code", deleteMaterial);

// PUT: Update material by ID
router.put("/:item_code", upload.single("file"), updateMaterial);

// GET: Stream file content by item_code
// GET: stream file by item_code
router.get('/api/material/file/:item_code', async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT item_file, item_name, item_type
      FROM tbl_materials
      WHERE item_code = ?
      LIMIT 1
    `, [req.params.item_code]);

    if (!rows.length || !rows[0].item_file) {
      return res.status(404).send("File not found");
    }

    // 1. Validation (Ensures only PDFs are served from this route)
    const type = (rows[0].item_type || "").toLowerCase();
    if (type !== "pdf") {
      return res.status(400).send("Only PDF files can be retrieved via this endpoint.");
    }

    // item_file (LONGBLOB) is automatically retrieved as a Node.js Buffer
    const fileBuffer = rows[0].item_file; 
    
    // Ensure the file name has the PDF extension for the client
    const fileName = rows[0].item_name || "file";
    const finalFilename = fileName.toLowerCase().endsWith('.pdf') ? fileName : `${fileName}.pdf`;

    // 2. Set Response Headers
    
    // FIX 1: Add CORS header back for front-end access
    res.setHeader("Access-Control-Allow-Origin", "*");
    
    // Set PDF MIME type
    res.setHeader("Content-Type", "application/pdf");
    
    // FIX 2: Set Content-Length header for better streaming reliability
    res.setHeader("Content-Length", fileBuffer.length); 

    // Use 'inline' to view the PDF in the browser (e.g., in the iframe)
    res.setHeader("Content-Disposition", `inline; filename="${finalFilename}"`);

    // 3. Send the Buffer (the binary file data)
    res.send(fileBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
