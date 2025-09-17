// middlewares/tokenMiddleware.js
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
  const reqPath = req.path.replace(/\/$/, "") || "/";

  // Comprobar si la ruta está excluida
  const isExcluded = pathsToExclude.some((p) => {
    const urlMatches = p.url instanceof RegExp ? p.url.test(reqPath) : p.url === reqPath;
    const methodMatches = p.methods.includes(req.method);
    return urlMatches && methodMatches;
  });

  if (isExcluded) {
    console.log(`[TokenMiddleware] Ruta excluida: ${req.method} ${reqPath}`);
    return next();
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log(`[TokenMiddleware] No se envió Authorization header en ${req.method} ${reqPath}`);
    return res.status(401).json({ message: "No token proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log(`[TokenMiddleware] Token malformado o faltante en ${req.method} ${reqPath}`);
    return res.status(401).json({ message: "Token malformado o faltante" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      console.log(`[TokenMiddleware] Token inválido: falta id en payload`, decoded);
      return res.status(401).json({ message: "Token inválido: falta id" });
    }

    req.user = { id: decoded.id };
    console.log(`[TokenMiddleware] Usuario autenticado: ${req.user.id} en ${req.method} ${reqPath}`);
    next();
  } catch (err) {
    console.log(`[TokenMiddleware] Error verificando token en ${req.method} ${reqPath}:`, err.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = tokenMiddleware;





