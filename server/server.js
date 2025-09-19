const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const mime = require('mime-types');
require("dotenv").config();

const userRoute = require("./routes/userRoute");
const boardRoute = require("./routes/boardRoute");
const listRoute = require("./routes/listRoute");
const cardRoute = require("./routes/cardRoute");
const tokenMiddleware = require("./middlewares/verifyTokenWrapper");

const app = express();

// Crear directorio uploads si no existe
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log("📁 Directorio 'uploads' creado");
}

// Middlewares básicos
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log("➡️ Petición entrante:", req.method, req.url);
  next();
});

// Servir archivos estáticos con Content-Type correcto
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(__dirname, 'uploads', req.path);
  
  // Verificar que el archivo existe
  if (!fs.existsSync(filePath)) {
    console.log("❌ Archivo no encontrado:", filePath);
    return res.status(404).send('Archivo no encontrado');
  }
  
  const contentType = mime.lookup(filePath) || 'application/octet-stream';
  
  console.log("📁 Sirviendo archivo:", {
    path: req.path,
    contentType: contentType,
    exists: fs.existsSync(filePath)
  });
  
  // Configurar headers específicos por tipo de archivo
  res.setHeader('Content-Type', contentType);
  res.setHeader('Cache-Control', 'public, max-age=31557600');
  
  if (contentType === 'application/pdf') {
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Accept-Ranges', 'bytes');
  } else if (contentType.startsWith('image/')) {
    res.setHeader('Content-Disposition', 'inline');
  }
  
  next();
}, express.static(path.join(__dirname, 'uploads'), {
  // Opciones adicionales para express.static
  dotfiles: 'ignore',
  etag: false,
  extensions: ['pdf', 'jpg', 'png', 'gif', 'doc', 'docx'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    // Headers adicionales si es necesario
    res.set('x-timestamp', Date.now());
  }
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://tableros-53ww.onrender.com",
  credentials: true,
}));

// APLICAR EL MIDDLEWARE DE TOKEN GLOBALMENTE ANTES DE LAS RUTAS
app.use(tokenMiddleware);

// RUTAS API
app.use("/api/users", userRoute);
app.use("/api/boards", boardRoute);
app.use("/api/lists", listRoute);
app.use("/api/cards", cardRoute);

// Servir React build
app.use(express.static(path.join(__dirname, "../client/build")));

// Catch-all handler
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.log("❌ MongoDB error:", err));

// Puerto
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log("📁 Directorio uploads configurado en:", path.join(__dirname, 'uploads'));
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
});


