import express from "express";
import cors from "cors";
import "dotenv/config";
import supabase from "./config/supabase.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import promptRoute from "./routes/prompts.js";
import loginRoute from "./routes/login.js";
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

app.use("/login", loginRoute);

app.listen(PORT, "192.168.1.78", () => {
  console.log(`Server running on http://192.168.1.78:${PORT}`);
});
