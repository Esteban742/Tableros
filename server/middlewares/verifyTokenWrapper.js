const jwt = require("jsonwebtoken");

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
    const matchUrl = p.url instanceof RegExp ? p.url.test(req.path) : p.url === req.path;
    const matchMethod = p.methods.includes(req.method);
    return matchUrl && matchMethod;
  });

  if (excluded) return next();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ errMessage: "Token missing" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ errMessage: "Invalid token" });
  }
}

module.exports = tokenMiddleware;




