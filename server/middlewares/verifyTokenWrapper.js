const jwt = require("jsonwebtoken");

const pathsToExclude = [
  { url: "/users/register", methods: ["POST"] },
  { url: "/users/login", methods: ["POST"] },
  { url: "/", methods: ["GET"] },
  { url: /^\/static\/.*/, methods: ["GET"] },
  { url: "/favicon.ico", methods: ["GET"] },
  { url: "/manifest.json", methods: ["GET"] },
];

const tokenMiddleware = (req, res, next) => {
  const reqPath = req.path.replace(/\/$/, "") || "/";

  const excluded = pathsToExclude.some((p) => {
    const matchUrl = p.url instanceof RegExp ? p.url.test(reqPath) : p.url === reqPath;
    const matchMethod = p.methods.includes(req.method);
    return matchUrl && matchMethod;
  });

  if (excluded) return next();

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log(`[TokenMiddleware] No se envió Authorization header`);
    return res.status(401).json({ message: "No token proporcionado" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log(`[TokenMiddleware] Token malformado o faltante`);
    return res.status(401).json({ message: "Token malformado o faltante" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id) {
      console.log(`[TokenMiddleware] Token inválido: falta id en payload`, decoded);
      return res.status(401).json({ message: "Token inválido: falta id" });
    }

    req.user = { id: decoded.id };
    console.log(`[TokenMiddleware] Usuario autenticado:`, req.user.id);
    next();
  } catch (err) {
    console.log(`[TokenMiddleware] Error verificando token:`, err.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

module.exports = tokenMiddleware;




