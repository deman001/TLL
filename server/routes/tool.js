import express from "express";
import { createTool, getTool, getToolById, deleteToolById, updateToolById } from "../controllers/tool.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from '../multer/index.js'

const router = express.Router();

router.get("/:id", verifyToken, getToolById);
router.put("/:id", verifyToken, upload.array("picture", 10), updateToolById);
router.delete("/:id", verifyToken, deleteToolById);
router.get("/", verifyToken, getTool);
router.post("/", verifyToken, upload.array("picture", 10), createTool);

export default router;