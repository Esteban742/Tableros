// =========================
// server/server.js
// =========================

// Importaciones
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const unless = require("express-unless");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Rutas
const userRoute = require("./routes/userRoute");
const boardRoute = require("./routes/boardRoute");
const listRoute = require("./routes/listRoute");
const cardRoute = require("./routes/cardRoute");

// Middlewares
const verifyToken = require("./middlewares/verifyToken");

const app = express();

// =========================
// Middlewares
// =========================
app.use(cors());
app.use(express.json());

// Excluir archivos públicos y rutas de login/register del token
verifyToken.unless = unless;
app.use(
  verifyToken.unless({
    path: [
      { url: "/", methods: ["GET"] },
      { url: /^\/static\/.*/, methods: ["GET"] },
      { url: "/favicon.ico", methods: ["GET"] },
      { url: "/manifest.json", methods: ["GET"] },
      { url: "/api/users/register", methods: ["POST"] },
      { url: "/api/users/login", methods: ["POST"] },
    ],
  })
);

// =========================
// Rutas API
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
  console.error("❌ MONGO_URL no está definido");
  process.exit(1);
}

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Conectado a MongoDB");

    const PORT = process.env.PORT || 5000; // Render asigna el puerto dinámicamente
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err);
    process.exit(1);
  });




