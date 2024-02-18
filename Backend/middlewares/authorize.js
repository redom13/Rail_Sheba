const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorize = (req, res, next) => {
  // Get token from header
  const jwtToken = req.header("jwtToken");
  // Check if token exists
  if (!jwtToken) {
    console.log("No token");
    return res.status(403).json({ msg: "Authorization denied" });
  }
  // Verify token
  try {
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
    console.log(payload);
    req.user = payload.user;
    console.log(req.user);
    next();
  } catch (err) {
    console.error(err.message);
    console.log("Invalid token");
    return res.status(403).json({ msg: "Invalid token" });
  }
};

module.exports = authorize;