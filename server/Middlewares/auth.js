const jwt = require("jsonwebtoken");
const unless = require("express-unless");

// Middleware para verificar token
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ errMessage: "Authorization token not found!" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Guardamos datos del usuario en la request
    next();
  } catch (err) {
    res.status(400).json({ errMessage: "Invalid Token" });
  }
};

// Agregar soporte para unless
verifyToken.unless = unless;

module.exports = verifyToken;
