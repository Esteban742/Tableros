const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ errMessage: "Authorization token not found!" });
  }

  try {
    // Validar token
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded; // guardar payload en la request
    next();
  } catch (err) {
    return res.status(401).json({ errMessage: "Invalid or expired token!" });
  }
}

module.exports = verifyToken;
