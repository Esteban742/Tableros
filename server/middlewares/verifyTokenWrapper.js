// middlewares/verifyTokenWrapper.js

// Función verifyToken
function verifyToken(req, res, next) {
  const authHeader = req.headers.token;
  if (!authHeader) return res.status(401).json({ errMessage: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    // Aquí tu lógica de verificación con jwt
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ errMessage: "Token is not valid" });
  }
}

// Paths que no requieren token
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

  verifyToken(req, res, next);
}

module.exports = tokenMiddleware;



