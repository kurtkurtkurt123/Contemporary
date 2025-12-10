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



module.exports = router;
