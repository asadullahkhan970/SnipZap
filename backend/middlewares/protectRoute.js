import jwt from "jsonwebtoken";
import User from "../models/userModels.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({ message: "Unauthorized, user not found" });
        }

        req.user = user;  // Ensure req.user is correctly set
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log("Error in protectRoute:", error.message);
    }
};

export default protectRoute;
