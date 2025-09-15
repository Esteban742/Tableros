const jwt = require("jsonwebtoken");
const unless = require("express-unless");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ message: "No token provided." });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized!" });
    req.user = decoded;
    next();
  });
};

// Habilita el uso de .unless directamente en el middleware
verifyToken.unless = unless;

module.exports = verifyToken;


