import jwt from "jsonwebtoken";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import authenticateToken from "../middleware/authMiddleware.js";
import supabase from "../config/supabase.js";

const router = express.Router();

// Date format
const date = new Date();
const formattedDate = date.toISOString().split("T")[0];

router.post("/add-photo", authenticateToken, async (req, res) => {
  try {
    const { prompt_id, image_url, note } = req.body;
    const user_id = req.user?.userId;

    console.log("Received request to /add-photo:");
    console.log("Request Body:", req.body);
    console.log("req.user:", req.user);
    console.log("Prompt ID:", prompt_id);
    console.log("User ID from JWT:", user_id);

    if (!prompt_id || !image_url || !user_id) {
      return res.status(400).json({
        error:
          "Missing required fields: prompt_id, image_url, and user_id are required",
      });
    }

    const { data: promptData, error: promptError } = await supabase
      .from("prompts")
      .select("id")
      .eq("id", prompt_id)
      .single();

    if (promptError || !promptData) {
      return res
        .status(400)
        .json({ error: "Invalid prompt_id. Prompt does not exist" });
    }

    const { data, error } = await supabase.from("photos").insert({
      user_id,
      prompt_id,
      image_url,
      note,
      date: formattedDate,
    });

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({
        error: "Failed to add photo to database",
        details: error.message,
        code: error.code,
      });
    }

    res.status(201).json({ message: "Photo added successfully", data });
  } catch (error) {
    console.error("Error adding photo:", error);
    res
      .status(500)
      .json({ error: "Failed to add photo", details: error.message });
  }
});

export default router;
