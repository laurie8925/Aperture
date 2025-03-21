import "dotenv/config";
import jwt from "jsonwebtoken";

const { SUPABASE_JWT_SECRET } = process.env;

function authenticateToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "No JWT provided" });
  }
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Bearer header backend", req.headers.authorization);
  try {
    console.log("before decode", token);
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
    req.user = decoded;
    console.log("after decode", token);
    console.log("Decoded user:", req.user);
    next();
  } catch (err) {
    console.log("Verification error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export default authenticateToken;
