import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
  // console.log("Headers received:", req.headers); 

  try {
    const authHeader = req.header("Authorization");
    // console.log("Authorization header:", authHeader); 

    const token = authHeader?.split(' ')[1];
    // console.log("Extracted token:", token); 

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No Token Provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:", decoded); 

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(401).json({ error: "Unauthorized - Invalid Token" });
  }
};

export default protectRoute;