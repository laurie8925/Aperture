import express from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";
import supabase from "../config/supabase.js";

const router = express.Router();

const { SUPABASE_JWT_SECRET } = process.env;

router.route("/").post(async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase Auth Error:", error); // Log the actual error from Supabase
      return res
        .status(401)
        .json({ message: "Authentication failed", error: error.message });
    }

    if (!data) {
      return res
        .status(401)
        .json({ message: "Authentication failed: No data found" });
    }

    const user = data.user;
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      SUPABASE_JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.route("/signup").post(async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      name,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    //currently turned off for now
    if (!data.session) {
      return res.status(200).json({
        message: "Please check your inbox for email verification!",
        user: data.user,
      });
    }

    return res.status(200).json({
      message: "Signup successful",
      user: data.user,
      session: data.session,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
});

export default router;
