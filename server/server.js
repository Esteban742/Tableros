// =========================
// server.js
// =========================

// Importaciones
const dotenv = require("dotenv");
dotenv.config(); // Carga las variables de entorno

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Rutas
const userRoute = require("./routes/userRoute");
const boardRoute = require("./routes/boardRoute");
const listRoute = require("./routes/listRoute");
const cardRoute = require("./routes/cardRoute");

// Middlewares
const tokenMiddleware = require("./middlewares/verifyTokenWrapper");

const app = express();

// =========================
// Middlewares generales
// =========================
app.use(express.json());

// CORS
const allowedOrigins = [
  "http://localhost:3000",                // desarrollo local
  "https://tableros-53ww.onrender.com"    // producción
];

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // peticiones desde Postman u otros
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error(`CORS: origen no permitido: ${origin}`), false);
    }
    return callback(null, true);
  },
  credentials: true, // permite cookies y headers con credenciales
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // ✅ CORRECTO
// preflight para POST, PUT, DELETE, etc.

// =========================
// Middleware de token
// =========================
app.use(tokenMiddleware);

// =========================
// Rutas API protegidas
// =========================
app.use("/api/users", userRoute);
app.use("/api/boards", boardRoute);
app.use("/api/lists", listRoute);
app.use("/api/cards", cardRoute);

// =========================
// Servir React Build (producción)
// =========================
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// =========================
// Conexión a MongoDB y servidor
// =========================
const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
  console.error("❌ Error: la variable de entorno MONGO_URL no está definida");
  process.exit(1);
}

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Conectado a MongoDB");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err);
    process.exit(1);
  });

