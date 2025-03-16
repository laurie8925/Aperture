import "dotenv";

const { SUPABASE_JWT_SECRET } = process.env;

function authenticateToken(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "No JWT provided" });
  }
  const token = req.header("Authorization")?.replace("Bearer ", ""); // Extract "Bearer token"

  try {
    const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
    req.user = decoded;
    console.log(req.user);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export default authenticateToken;
