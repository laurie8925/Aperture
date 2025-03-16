import jwt from "jsonwebtoken";
import "dotenv/config";

const hmacSecret = process.env.SUPABASE_JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = parseJWTToken(token, hmacSecret);
    console.log(`Received request from ${decoded.email}`);
    req.email = decoded.email; // Store email in request object
    next();
  } catch (err) {
    console.error(`Error parsing token: ${err.message}`);
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default authMiddleware;
