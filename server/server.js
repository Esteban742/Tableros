const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const userRoute = require("./routes/userRoute");
const boardRoute = require("./routes/boardRoute");
const listRoute = require("./routes/listRoute");
const cardRoute = require("./routes/cardRoute");
const tokenMiddleware = require("./middlewares/verifyTokenWrapper");

const app = express();

// Crear directorio uploads temporal (solo para procesamiento temporal antes de subir a Cloudinary)
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log("📁 Directorio temporal 'uploads' creado");
}

// Middlewares básicos
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log("➡️ Petición entrante:", req.method, req.url);
  next();
});

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
  console.log("☁️ Archivos se almacenarán en Cloudinary (no localmente)");
  console.log("📁 Directorio temporal uploads/ solo para procesamiento");
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
});

