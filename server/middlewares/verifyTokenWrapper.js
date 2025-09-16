// middlewares/verifyTokenWrapper.js
const jwt = require("jsonwebtoken");

// Rutas que no requieren token
const pathsToExclude = [
  { url: "/", methods: ["GET"] },
  { url: /^\/static\/.*/, methods: ["GET"] },
  { url: "/favicon.ico", methods: ["GET"] },
  { url: "/manifest.json", methods: ["GET"] },
  { url: "/api/users/register", methods: ["POST"] },
  { url: "/api/users/login", methods: ["POST"] },
];

const tokenMiddleware = (req, res, next) => {
  const excluded = pathsToExclude.some((p) => {
    const matchUrl =
      p.url instanceof RegExp ? p.url.test(req.path) : p.url === req.path;
    const matchMethod = p.methods.includes(req.method);
    return matchUrl && matchMethod;
  });

  if (excluded) return next();

  // Verificar token JWT
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token)
    return res.status(401).json({ message: "Token malformado o faltante" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // opcional: info del usuario disponible en req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = tokenMiddleware;




