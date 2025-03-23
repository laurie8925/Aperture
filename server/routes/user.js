import express from "express";
import authenticateToken from "../middleware/authMiddleware.js";
import supabase from "../config/supabase.js";

const router = express.Router();

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("email, name")
      .eq("id", req.user.userId)
      .single();

    if (fetchError) {
      console.error("Profile fetch error:", fetchError);
      return res.status(404).json({ message: "Profile not found" });
    }

    //update active state
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ is_active: true })
      .eq("id", req.user.userId);

    if (updateError) {
      console.error("Profile update error:", updateError);
      return res.status(500).json({ message: "Error updating profile" });
    }

    res.json({
      user: {
        userId: req.user.userId,
        email: profile.email,
        name: profile.username,
      },
    });
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/logout", authenticateToken, async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .eq("id", req.user.userId)
      .single()
      .update({ is_active: false });

    if (error) {
      console.error("Profile fetch error:", error);
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json({
      user: {
        userId: req.user.userId,
        email: profile.email,
        name: profile.username,
      },
    });
  } catch (error) {
    console.error("User fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
