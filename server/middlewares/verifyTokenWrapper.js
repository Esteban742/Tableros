// middlewares/verifyTokenWrapper.js
const jwt = require("jsonwebtoken");

// Rutas que NO requieren token
const pathsToExclude = [
  { url: "/api/users/register", methods: ["POST"] },
  { url: "/api/users/login", methods: ["POST"] },
  { url: "/", methods: ["GET"] },
  { url: /^\/static\/.*/, methods: ["GET"] },
  { url: "/favicon.ico", methods: ["GET"] },
  { url: "/manifest.json", methods: ["GET"] },
];

const tokenMiddleware = (req, res, next) => {
  // Normalizar path para evitar errores de trailing slash
  const reqPath = req.path.endsWith("/") && req.path.length > 1 
    ? req.path.slice(0, -1)
    : req.path;

  const excluded = pathsToExclude.some((p) => {
    const matchUrl = p.url instanceof RegExp ? p.url.test(reqPath) : p.url === reqPath;
    const matchMethod = p.methods.includes(req.method);
    return matchUrl && matchMethod;
  });

  if (excluded) return next();

  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token malformado o faltante" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = tokenMiddleware;




