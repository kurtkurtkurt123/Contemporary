const express = require("express");
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

module.exports = router;
