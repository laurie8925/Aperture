import express from "express";
import * as promptsController from "../controllers/prompts.js";

const router = express.Router();

router.route("/").get(promptsController.getAllPrompts);
router.route("/today");

export default router;
