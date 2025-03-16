import express from "express";
import cors from "cors";
import "dotenv/config";
import supabase from "./config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import promptRoute from "./routes/prompts.js";
import authenticateToken from "./middleware/authMiddleware.js";

const app = express();

const PORT = process.env.PORT || 5050;
const { SUPABASE_JWT_SECRET } = process.env;

app.use(cors());
app.use(express.json());

app.use("/prompts", promptRoute);
app.use("/user", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.post("/login", async (req, res) => {
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

    // Compare hashed password with the provided password

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

const date = new Date();
const formattedDate = date.toISOString().split("T")[0];

app.listen(PORT, "192.168.1.78", () => {
  console.log(`Server running on http://192.168.1.78:${PORT}`);
});
