import express from "express";
import { createLending, getLendingById, getLendings } from "../controllers/lending.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/:id", verifyToken, getLendingById);
router.get("/", verifyToken, getLendings);
router.post("/", verifyToken, createLending);

export default router;
