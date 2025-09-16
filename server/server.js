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

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://tableros-53ww.onrender.com",
  credentials: true,
}));

// Rutas API
app.use("/api/users", userRoute);
app.use("/api/boards", tokenMiddleware, boardRoute);
app.use("/api/lists", tokenMiddleware, listRoute);
app.use("/api/cards", tokenMiddleware, cardRoute);

// Servir React build
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

// Conexión MongoDB
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.log("MongoDB error:", err));

// Puerto
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));



