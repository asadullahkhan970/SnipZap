import jwt from "jsonwebtoken";

const generateTokenAndsetCookie = (userId, res) => {
    // Get the current timestamp in seconds
    const now = Math.floor(Date.now() / 1000);
    // Calculate the expiration time (30 days from now)
    const exp = now + 30 * 24 * 60 * 60; // 30 days from now in seconds

    // Generate the JWT with a custom expiration date
    const token = jwt.sign(
        { userId, exp }, // Set expiration in the payload
        process.env.JWT_SECRET
    );

    // Debugging logs to verify the JWT expiration date
    console.log("Generated JWT Expiration Date:", new Date(exp * 1000));

    // Set the cookie with a maxAge of 30 days (in milliseconds)
    res.cookie("jwt", token, {
        httpOnly: true, // More secure
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
        sameSite: "strict", // CSRF protection
        secure: process.env.NODE_ENV === "production", // Set to true in production over HTTPS
    });

    return token;
};

export default generateTokenAndsetCookie;
