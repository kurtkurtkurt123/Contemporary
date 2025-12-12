const express = require("express");
<<<<<<< HEAD
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


=======
const multer = require("multer"); // <-- import multer
const {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial
} = require("../Controller/materialsController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// CREATE MATERIAL (metadata + optional file)
router.post("/create", createMaterial); // keep it as metadata-only for now

// UPDATE MATERIAL (metadata + optional file)
router.put("/:item_code", upload.single("file"), updateMaterial);

// GET ALL MATERIALS
router.get("/get", getMaterials);

// GET SINGLE MATERIAL
router.get("/:item_code", getMaterialById);

// DELETE MATERIAL (DB + file in Storage)
router.delete("/:item_code", deleteMaterial);
>>>>>>> test/supabase-migration

module.exports = router;
