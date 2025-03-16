import express from "express";
import cors from "cors";
import "dotenv/config";
import jwt from "jsonwebtoken";
import promptRoute from "./routes/prompts.js";
import authMiddleware from "./middleware/authMiddleware.js";

const app = express();

const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.use("/prompts", promptRoute);

const hmacSecret = process.env.SUPABASE_JWT_SECRET;

if (!hmacSecret) {
  console.error("Please set the SUPABASE_JWT_SECRET environment variable");
  process.exit(1);
}

const secretRouteHandler = (req, res) => {
  const email = req.email;
  res.json({
    message: `our hidden value for the user ${email}`,
  });
};

app.post("/secret", authMiddleware, secretRouteHandler);

function parseJWTToken(token, secret) {
  try {
    const decoded = jwt.verify(token, secret, {
      algorithms: ["HS256"], // Enforce HMAC SHA256
    });

    if (!decoded.email) {
      throw new Error("Email claim not found in token");
    }

    return {
      email: decoded.email,
    };
  } catch (err) {
    throw new Error(`Error validating token: ${err.message}`);
  }
}

const corsOptions = {
  origin: "*", // Not recommended for production
  allowedHeaders: ["Origin", "Content-Length", "Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

const date = new Date();
const formattedDate = date.toISOString().split("T")[0];

app.listen(PORT, () => {
  console.log(`server running on port: ${PORT}`);
});
