import jwt from "jsonwebtoken";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import authenticateToken from "../middleware/authMiddleware.js";
import supabase from "../config/supabase.js";
import * as photoControllers from "../controllers/photo.js";

const router = express.Router();

// Date format
const date = new Date();
const formattedDate = date.toISOString().split("T")[0];

router.post("/add-photo", authenticateToken, async (req, res) => {
  try {
    const { prompt_id, image_url, note, prompt } = req.body;
    const user_id = req.user?.userId;

    console.log("API /add-photo - user_id:", user_id);
    console.log("API /add-photo - prompt_id:", prompt_id);
    console.log("API /add-photo - image_url:", image_url);
    console.log("API /add-photo - note:", note);

    if (!prompt_id || !image_url || !user_id) {
      return res.status(400).json({
        error:
          "Missing required fields: prompt_id, image_url, and user_id are required",
      });
    }

    // const { data: promptData, error: promptError } = await supabase
    //   .from("prompts")
    //   .select("id")
    //   .eq("id", prompt_id)
    //   .single();

    // if (promptError || !promptData) {
    //   return res
    //     .status(400)
    //     .json({ error: "Invalid prompt_id. Prompt does not exist" });
    // }

    const { data, error } = await supabase
      .from("photos")
      .insert({
        user_id,
        prompt_id,
        image_url,
        note,
        date: formattedDate,
        prompt,
      })
      .select()
      .single();

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

router.get("/today", authenticateToken, async (req, res) => {
  try {
    const { prompt_id } = req.query;
    if (!prompt_id) {
      return res.status(400).json({ message: "Missing prompt_id parameter" });
    }

    const user_id = req.user?.userId;
    console.log(`API /today - user_id:`, user_id);
    console.log(`API /today - prompt_id:`, prompt_id);

    const { data, error } = await supabase
      .from("photos")
      .select()
      .eq("user_id", user_id)
      .eq("prompt_id", prompt_id)
      .order("date", { ascending: false })
      .limit(1)
      .single();

    console.log(`API /today - Error:`, error);
    console.log(`API /today- Response sent:`, data || false);

    if (error) {
      console.error(`API /today - Query error:`, error);
      return res.status(500).json({ message: "Query failed", error });
    }

    res.json(data || false);
  } catch (error) {
    console.error(`API /today - General error:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router("/user/entries", authenticateToken, photoControllers.getAllPhotos);

export default router;
