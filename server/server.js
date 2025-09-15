// Importaciones
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const unless = require("express-unless");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const userRoute = require("./Routes/userRoute");
const boardRoute = require("./Routes/boardRoute");
const listRoute = require("./Routes/listRoute");
const cardRoute = require("./Routes/cardRoute");
const verifyToken = require("./Middlewares/verifyToken");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Excluir archivos estáticos y manifest/favicons del token
verifyToken.unless = unless;
app.use(
  verifyToken.unless({
    path: [
      { url: "/", methods: ["GET"] },
      { url: /^\/static\/.*/, methods: ["GET"] }, // JS y CSS generados
      { url: "/favicon.ico", methods: ["GET"] },
      { url: "/manifest.json", methods: ["GET"] },
    ],
  })
);

// Rutas API protegidas
app.use("/api/users", userRoute);
app.use("/api/boards", boardRoute);
app.use("/api/lists", listRoute);
app.use("/api/cards", cardRoute);

// Servir React Build (producción)
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// Conexión a MongoDB y puerto
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Conectado a MongoDB");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Servidor corriendo en puerto ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.log(err));

