// Importaciones
const dotenv = require('dotenv');
const express = require('express');
const unless = require('express-unless');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // <-- Mantenemos solo una declaración
const userRoute = require('./Routes/userRoute');
const boardRoute = require('./Routes/boardRoute');
const listRoute = require('./Routes/listRoute');
const cardRoute = require('./Routes/cardRoute');
const auth = require('./Middlewares/auth');

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos subidos estáticamente
app.use('/uploads', express.static('uploads'));

// Autenticación con 'unless'
auth.verifyToken.unless = unless;
app.use(
  auth.verifyToken.unless({
    path: [
      { url: '/user/login', method: ['POST'] },
      { url: '/user/register', method: ['POST'] },
    ],
  })
);

// Conexión a MongoDB
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Database connection is successful!'))
  .catch((err) => {
    console.log('Database connection failed!');
    console.log(`Details: ${err}`);
  });

// Rutas API
app.use('/user', userRoute);
app.use('/board', boardRoute);
app.use('/list', listRoute);
app.use('/card', cardRoute);

// Servir React en producción
if (process.env.NODE_ENV === 'production') {
  // Ajuste de ruta: ../client/build porque server está dentro de 'server/'
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'));
  });
}

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is online! Port: ${PORT}`);
});
