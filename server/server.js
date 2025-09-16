const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const unless = require("express-unless");

dotenv.config();

const userRoute = require("./routes/userRoute");
const boardRoute = require("./routes/boardRoute");
const listRoute = require("./routes/listRoute");
const cardRoute = require("./routes/cardRoute");
const tokenMiddleware = require("./middlewares/verifyTokenWrapper");

const app = express();

// Middlewares
app.use(express.json());

// Configurar CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://tableros-53ww.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware global para rutas protegidas, excepto registro y login
tokenMiddleware.unless = unless;
app.use(
  tokenMiddleware.unless({
    path: [
      { url: "/api/users/register", methods: ["POST"] },
      { url: "/api/users/login", methods: ["POST"] },
    ],
  })
);

// Rutas
app.use("/api/users", userRoute);
app.use("/api/boards", boardRoute);
app.use("/api/lists", listRoute);
app.use("/api/cards", cardRoute);

// Servir React en producción
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });
}

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.log("MongoDB error:", err));

// Puerto
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));

