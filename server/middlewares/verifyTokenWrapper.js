const jwt = require("jsonwebtoken");

// Rutas que NO requieren token (rutas públicas)
const pathsToExclude = [
  // Rutas estáticas del frontend
  { url: "/", methods: ["GET"] },
  { url: /^\/static\/.*/, methods: ["GET"] },
  { url: "/favicon.ico", methods: ["GET"] },
  { url: "/manifest.json", methods: ["GET"] },
  
  // Rutas de autenticación (públicas)
  { url: "/api/users/register", methods: ["POST"] },
  { url: "/api/users/login", methods: ["POST"] },
  { url: "/api/users/getUserWithMail", methods: ["POST"] },
];

const tokenMiddleware = (req, res, next) => {
  const reqPath = req.path.replace(/\/$/, "") || "/";
  
  console.log(`[TokenMiddleware] 🔍 Procesando: ${req.method} ${reqPath}`);
  
  // Comprobar si la ruta está excluida (no requiere token)
  const isExcluded = pathsToExclude.some((p) => {
    const urlMatches = p.url instanceof RegExp ? p.url.test(reqPath) : p.url === reqPath;
    const methodMatches = p.methods.includes(req.method);
    return urlMatches && methodMatches;
  });
  
  if (isExcluded) {
    console.log(`[TokenMiddleware] ✅ Ruta excluida (pública): ${req.method} ${reqPath}`);
    return next();
  }

  // Esta ruta requiere token
  console.log(`[TokenMiddleware] 🔒 Ruta protegida: ${req.method} ${reqPath} - Verificando token...`);
  
  // Buscar token en el header Authorization
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    console.log(`[TokenMiddleware] ❌ No se encontró Authorization header en ${req.method} ${reqPath}`);
    console.log(`[TokenMiddleware] Headers disponibles:`, Object.keys(req.headers));
    return res.status(401).json({ 
      success: false,
      message: "No token proporcionado" 
    });
  }
  
  // Verificar formato Bearer Token
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    console.log(`[TokenMiddleware] ❌ Token malformado en ${req.method} ${reqPath}. Formato recibido: "${authHeader}"`);
    return res.status(401).json({ 
      success: false,
      message: "Token malformado. Formato esperado: 'Bearer <token>'" 
    });
  }
  
  const token = parts[1];
  console.log(`[TokenMiddleware] 🔑 Token encontrado, verificando validez...`);
  
  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded || !decoded.id) {
      console.log(`[TokenMiddleware] ❌ Token inválido: falta ID en payload`, decoded);
      return res.status(401).json({ 
        success: false,
        message: "Token inválido: payload incorrecto" 
      });
    }
    
    // ✅ Asignar usuario a req.user para que esté disponible en los controllers
    req.user = { id: decoded.id };
    console.log(`[TokenMiddleware] ✅ Usuario autenticado correctamente: ID ${req.user.id} en ${req.method} ${reqPath}`);
    
    // Continuar con el siguiente middleware/controller
    next();
    
  } catch (err) {
    console.log(`[TokenMiddleware] ❌ Error verificando token en ${req.method} ${reqPath}:`, err.message);
    
    // Diferentes tipos de errores de JWT
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: "Token expirado" 
      });
    } else if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: "Token inválido" 
      });
    } else {
      return res.status(401).json({ 
        success: false,
        message: "Error de autenticación" 
      });
    }
  }
};

module.exports = tokenMiddleware;





