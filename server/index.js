/*TODO:
- add /user route
- update user route to get data from public profile database 
- add route to index
- add /user/sign up call to supabase.auth.signupp and add to */
import express from "express";
import cors from "cors";
import "dotenv/config";

import promptRoute from "./routes/prompts.js";
import authRoute from "./routes/auth.js";
import photoRoute from "./routes/photo.js";
import userRoute from "./routes/user.js";
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

//routes
app.use("/prompts", promptRoute); //get  prompt
app.use("/auth", authRoute); //auth login
app.use("/photo", photoRoute); //photos
app.use("/user", userRoute); //get user info from public table

app.listen(PORT, backendUrl, () => {
  console.log(`Server running on http://${backendUrl}:${PORT}`);
});
