const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Rutas que NO requieren token
const pathsToExclude = [
  // ===== PÁGINAS PRINCIPALES =====
  { url: "/", methods: ["GET", "HEAD"] },               // Página principal + health checks
  { url: "/login", methods: ["GET"] },                  // SPA login page
  { url: "/register", methods: ["GET"] },               // SPA register page
  
  // ===== ARCHIVOS ESTÁTICOS GENERALES =====
  { url: /^\/static\/.*/, methods: ["GET"] },           // Archivos estáticos de React
  { url: "/favicon.ico", methods: ["GET"] },            // Favicon raíz
  { url: "/manifest.json", methods: ["GET"] },          // Manifest raíz
  
  // ===== ARCHIVOS ESTÁTICOS EN RUTAS /board/ =====
  { url: /^\/board\/favicon\.ico$/, methods: ["GET"] }, // Favicon en /board/
  { url: /^\/board\/manifest\.json$/, methods: ["GET"] }, // Manifest en /board/
  { url: /^\/board\/static\/.*/, methods: ["GET"] },    // Static files en /board/
  
  // ===== ARCHIVOS POR EXTENSIÓN =====
  { url: /.*\.svg$/, methods: ["GET"] },                // Archivos SVG
  { url: /.*\.png$/, methods: ["GET"] },                // Archivos PNG
  { url: /.*\.jpg$/, methods: ["GET"] },                // Archivos JPG
  { url: /.*\.jpeg$/, methods: ["GET"] },               // Archivos JPEG
  { url: /.*\.gif$/, methods: ["GET"] },                // Archivos GIF
  { url: /.*\.ico$/, methods: ["GET"] },                // Archivos ICO
  { url: /.*\.css$/, methods: ["GET"] },                // Archivos CSS
  { url: /.*\.css\.map$/, methods: ["GET"] },           // Source maps CSS
  { url: /.*\.js\.map$/, methods: ["GET"] },            // Source maps JS
  
  // ===== RUTAS DE AUTENTICACIÓN =====
  { url: "/api/users/login", methods: ["POST"] },       // API login
  { url: "/api/users/register", methods: ["POST"] },    // API register
  
  // ===== UPLOADS =====
  { url: /^\/uploads\/.*/, methods: ["GET"] },          // Archivos subidos
];

const verifyTokenWrapper = async (req, res, next) => {
  try {
    const pathExcluded = pathsToExclude.some(
      (p) =>
        (typeof p.url === "string" ? p.url === req.path : p.url.test(req.path)) &&
        p.methods.includes(req.method)
    );
    
    if (pathExcluded) {
      console.log(`[TokenMiddleware] Ruta excluida (pública): ${req.method} ${req.path}`);
      return next();
    }

    console.log(`[TokenMiddleware] Ruta protegida: ${req.method} ${req.path} - Verificando token...`);
    
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      console.log("[TokenMiddleware] Token no encontrado");
      return res.status(401).json({ errMessage: "Token no proporcionado" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      console.log("[TokenMiddleware] Token inválido");
      return res.status(401).json({ errMessage: "Token inválido" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("[TokenMiddleware] Usuario no encontrado con ID del token");
      return res.status(401).json({ errMessage: "Usuario no encontrado" });
    }

    // MANTENER la estructura exacta que hace que los miembros se vean bien
    req.user = { 
      id: user._id, 
      email: user.email, 
      name: user.name,
      boards: user.boards || []
    };

    console.log(`[TokenMiddleware] Usuario autenticado correctamente: ${user.email}`);
    next();
  } catch (error) {
    console.error("[TokenMiddleware] Error verificando token:", error.message);
    return res.status(401).json({ errMessage: "Token inválido o expirado" });
  }
};

module.exports = verifyTokenWrapper;



