// middlewares/verifyTokenWrapper.js
const jwt = require("jsonwebtoken"); // si necesitas JWT

const pathsToExclude = [
  { url: "/", methods: ["GET"] },
  { url: /^\/static\/.*/, methods: ["GET"] },
  { url: "/favicon.ico", methods: ["GET"] },
  { url: "/manifest.json", methods: ["GET"] },
  { url: "/api/users/register", methods: ["POST"] },
  { url: "/api/users/login", methods: ["POST"] },
];

function tokenMiddleware(req, res, next) {
  const excluded = pathsToExclude.some((p) => {
    const matchUrl =
      p.url instanceof RegExp ? p.url.test(req.path) : p.url === req.path;
    const matchMethod = p.methods.includes(req.method);
    return matchUrl && matchMethod;
  });

  if (excluded) return next();

  // Aquí va tu lógica de verificación JWT
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ errMessage: "Token no proporcionado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ errMessage: "Token inválido" });
  }
}

module.exports = tokenMiddleware;


