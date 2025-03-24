import express from "express";
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

    if (!prompt_id || !image_url || !user_id) {
      return res.status(400).json({
        error:
          "Missing required fields: prompt_id, image_url, and user_id are required",
      });
    }

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

    const { data, error } = await supabase
      .from("photos")
      .select()
      .eq("user_id", user_id)
      .eq("prompt_id", prompt_id)
      .order("date", { ascending: false })
      .limit(1)
      .single();

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

router.get("/user/entries", authenticateToken, photoControllers.getAllPhotos);

router.post("/edit", authenticateToken, async (req, res) => {
  try {
    const { id, note, image_url } = req.body;
    const user_id = req.user?.userId;

    if (!id) {
      return res.status(400).json({
        error: "Missing photo id",
      });
    }

    // Validate inputs
    if (note && typeof note !== "string") {
      return res.status(400).json({
        error: "Note must be a string",
      });
    }
    if (
      image_url &&
      (typeof image_url !== "string" || !image_url.match(/^https?:\/\/.+/))
    ) {
      return res.status(400).json({
        error: "Image URL must be a valid URL string",
      });
    }

    // Verify the photo belongs to the user
    const { data: existingPhoto, error: checkError } = await supabase
      .from("photos")
      .select("user_id")
      .eq("id", id)
      .single();

    if (checkError) {
      console.error("Supabase check error:", checkError);
      return res.status(500).json({
        error: "Failed to verify photo ownership",
        details: checkError.message,
      });
    }

    if (!existingPhoto || existingPhoto.user_id !== user_id) {
      return res.status(403).json({
        error: "Unauthorized: You can only edit your own photos",
      });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (note !== undefined) updateData.note = note;
    if (image_url !== undefined) updateData.image_url = image_url;

    // update the photo entry
    const { data, error } = await supabase
      .from("photos")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase update error:", error);
      return res.status(500).json({
        error: "Failed to update photo",
        details: error.message,
        code: error.code,
      });
    }

    res.status(200).json({
      message: "Photo updated successfully",
      data,
    });
  } catch (error) {
    console.error("Error updating photo:", error);
    res.status(500).json({
      error: "Failed to update photo",
      details: error.message,
    });
  }
});

export default router;
