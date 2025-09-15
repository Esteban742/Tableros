// Importaciones
const dotenv = require("dotenv");
const express = require("express");
const unless = require("express-unless");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const userRoute = require("./Routes/userRoute");
const boardRoute = require("./Routes/boardRoute");
const listRoute = require("./Routes/listRoute");
const cardRoute = require("./Routes/cardRoute");
const verifyToken = require("./Middlewares/auth");

// Cargar variables de entorno (.env en local)
dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos subidos estáticamente
app.use("/uploads", express.static("uploads"));

// Autenticación con unless
verifyToken.unless = unless;
app.use(
  verifyToken.unless({
    path: [
      { url: "/api/user/login", methods: ["POST"] },
      { url: "/api/user/register", methods: ["POST"] },
      { url: "/", methods: ["GET"] }, // ruta pública para probar
    ],
  })
);

// Conexión a MongoDB
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("❌ No se encontró la variable de entorno MONGO_URI");
} else {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("✅ Database connection is successful!"))
    .catch((err) => {
      console.error("❌ Database connection failed!");
      console.error(`Details: ${err.message}`);
    });
}

// Rutas API (todas bajo /api)
app.use("/api/user", userRoute);
app.use("/api/board", boardRoute);
app.use("/api/list", listRoute);
app.use("/api/card", cardRoute);

// Servir React en producción
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is online! Port: ${PORT}`);
});

