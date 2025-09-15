const verifyToken = require("./verifyToken"); // CORRECTO

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



