const express = require("express");
const jwt = require("jsonwebtoken");

// JWT verification middleware
function verifyToken(req, res, next) {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ 
      message: "Authentication required: Missing or invalid Authorization header",
      errorCode: "NO_AUTH_HEADER"
    });
  }

  // Extract token
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ 
      message: "Authentication required: No token provided",
      errorCode: "NO_TOKEN"
    });
  }

  // Verify JWT_SECRET is set
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not configured");
    return res.status(500).json({ 
      message: "Server configuration error",
      errorCode: "SERVER_CONFIG"
    });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {

      let message = "Invalid token";
      let errorCode = "INVALID_TOKEN";

      if (err.name === "TokenExpiredError") {
        message = "Token has expired";
        errorCode = "TOKEN_EXPIRED";
      } else if (err.name === "JsonWebTokenError") {
        message = "Malformed token";
        errorCode = "MALFORMED_TOKEN";
      }

      return res.status(401).json({ message, errorCode });
    }

    // Attach decoded user data to request
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;