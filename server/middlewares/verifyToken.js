// server/middlewares/verifyToken.js
const jwt = require("jsonwebtoken");
const unless = require("express-unless");

// Middleware para verificar token JWT
const verifyToken = (req, res, next) => {
  // Se espera que el token venga en la cabecera Authorization
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    // Guardamos la información del usuario decodificada
    req.user = decoded;
    next();
  });
};

// Esto habilita el uso de .unless()
verifyToken.unless = unless;

module.exports = verifyToken;

