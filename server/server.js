const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const userRoute = require("./routes/userRoute");
const boardRoute = require("./routes/boardRoute");
const listRoute = require("./routes/listRoute");
const cardRoute = require("./routes/cardRoute");
const tokenMiddleware = require("./middlewares/verifyTokenWrapper");

const app = express();

// ===== Middlewares =====
app.use(express.json());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ===== Rutas API =====
app.use("/api/users", userRoute);
app.use("/api/boards", tokenMiddleware, boardRoute);
app.use("/api/lists", tokenMiddleware, listRoute);
app.use("/api/cards", tokenMiddleware, cardRoute);

// ===== Servir React en producción =====
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"))
  );
}

// ===== Conexión a MongoDB y levantar servidor =====
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Conectado a MongoDB");

    // Manejo básico de errores de servidor
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send("Algo salió mal en el servidor");
    });

    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ Error conectando a MongoDB:", err);
  });


