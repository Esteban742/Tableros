const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const userRoute = require("./routes/userRoute");
const boardRoute = require("./routes/boardRoute");
const listRoute = require("./routes/listRoute");
const cardRoute = require("./routes/cardRoute");
const tokenMiddleware = require("./middlewares/verifyTokenWrapper");

const app = express();
app.use(express.json());

// Logger para ver todas las peticiones que llegan al backend
app.use((req, res, next) => {
  console.log("➡️ Petición entrante:", req.method, req.url);
  next();
});

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://tableros-53ww.onrender.com",
  credentials: true,
}));

// ✅ APLICAR EL MIDDLEWARE GLOBALMENTE ANTES DE LAS RUTAS
app.use(tokenMiddleware);

// ✅ RUTAS API (ahora TODAS pasan por el middleware)
app.use("/api/users", userRoute);
app.use("/api/boards", boardRoute);    // Ya no necesita el middleware aquí
app.use("/api/lists", listRoute);      // Ya no necesita el middleware aquí  
app.use("/api/cards", cardRoute);      // Ya no necesita el middleware aquí

// Servir React build
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.log("MongoDB error:", err));

// Puerto
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));


