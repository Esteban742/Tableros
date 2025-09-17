const jwt = require("jsonwebtoken");

// Rutas que NO requieren token
const pathsToExclude = [
  { url: "/", methods: ["GET"] },
  { url: /^\/static\/.*/, methods: ["GET"] },
  { url: "/favicon.ico", methods: ["GET"] },
  { url: "/manifest.json", methods: ["GET"] },
  // NOTA: Ya no excluimos register/login
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

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log(`[TokenMiddleware] Token malformado en ${req.method} ${reqPath}`);
    return res.status(401).json({ message: "Token malformado" });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id) {
      console.log(`[TokenMiddleware] Token inválido: falta id en payload`, decoded);
      return res.status(401).json({ message: "Token inválido" });
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






