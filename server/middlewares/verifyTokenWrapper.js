// server/middlewares/verifyTokenWrapper.js
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Rutas que NO requieren token
const pathsToExclude = [
  { url: "/", methods: ["GET"] },                       // Página principal
  { url: "/login", methods: ["GET"] },                  // SPA login page
  { url: "/register", methods: ["GET"] },               // SPA register page
  { url: /^\/static\/.*/, methods: ["GET"] },           // Archivos estáticos
  { url: "/favicon.ico", methods: ["GET"] },
  { url: "/manifest.json", methods: ["GET"] },
  { url: "/api/users/login", methods: ["POST"] },       // API login
  { url: "/api/users/register", methods: ["POST"] },    // API register
];

const verifyTokenWrapper = async (req, res, next) => {
  try {
    const pathExcluded = pathsToExclude.some(
      (p) =>
        (typeof p.url === "string" ? p.url === req.path : p.url.test(req.path)) &&
        p.methods.includes(req.method)
    );

    if (pathExcluded) {
      console.log(`[TokenMiddleware] ✅ Ruta excluida (pública): ${req.method} ${req.path}`);
      return next();
    }

    console.log(`[TokenMiddleware] 🔒 Ruta protegida: ${req.method} ${req.path} - Verificando token...`);

    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      console.log("[TokenMiddleware] ❌ Token no encontrado");
      return res.status(401).json({ errMessage: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      console.log("[TokenMiddleware] ❌ Token inválido");
      return res.status(401).json({ errMessage: "Token inválido" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("[TokenMiddleware] ❌ Usuario no encontrado con ID del token");
      return res.status(401).json({ errMessage: "Usuario no encontrado" });
    }

   req.user = { 
  id: user._id, 
  email: user.email, 
  name: user.name,
  boards: user.boards || [] // ← AGREGAR ESTA LÍNEA
};
    console.log(`[TokenMiddleware] ✅ Usuario autenticado correctamente: ${user.email}`);

    next();
  } catch (error) {
    console.error("[TokenMiddleware] ❌ Error verificando token:", error.message);
    return res.status(401).json({ errMessage: "Token inválido o expirado" });
  }
};

module.exports = verifyTokenWrapper;





