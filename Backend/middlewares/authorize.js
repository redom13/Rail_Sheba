const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorize = (req, res, next) => {
  // Get token from header
  const jwtToken = req.header("jwtToken");
  // Check if token exists
  if (!jwtToken) {
    return res.status(403).json({ msg: "Authorization denied" });
  }
  // Verify token
  try {
    const payload = jwt.verify(jwtToken, process.env.JWT_SECRET);
    req.user = payload.user;
    next();
  } catch (err) {
    console.error(err.message);
    return res.status(403).json({ msg: "Invalid token" });
  }
};

module.exports = authorize;