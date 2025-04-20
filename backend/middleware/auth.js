import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Check the decoded data
    console.log("Decoded Token:", decoded); // Log decoded token

    req.userId = decoded.id; // Attach user ID
    req.userRole = decoded.role; // Attach user role
    
    next();
  });
};

export default authMiddleware;
