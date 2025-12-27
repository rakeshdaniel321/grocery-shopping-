import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {

    try{
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }
} catch (error) {
    return res.status(401).json({ message: "Not authorized" }); 
    }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};


export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only access" });
  }
  next();
};



