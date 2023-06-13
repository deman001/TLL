import express from "express";
import {login, oauth_login} from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.post("/oauth_login", oauth_login)


export default router;
