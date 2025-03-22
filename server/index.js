/*TODO:
- add /user route
- update user route to get data from public profile database 
- add route to index*/
import express from "express";
import cors from "cors";
import "dotenv/config";

import promptRoute from "./routes/prompts.js";
import loginRoute from "./routes/login.js";
import photoRoute from "./routes/photo.js";
import authenticateToken from "./middleware/authMiddleware.js";

const app = express();

const PORT = process.env.PORT || 8080;
const backendUrl = process.env.BACKEND_IP;

app.use(cors());
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});
app.use(express.json());

app.use("/prompts", promptRoute);
app.get("/user", authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.use("/login", loginRoute);
app.use("/photo", photoRoute);

app.listen(PORT, backendUrl, () => {
  console.log(`Server running on http://${backendUrl}:${PORT}`);
});
