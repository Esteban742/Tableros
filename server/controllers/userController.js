// server/controllers/userController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userService = require("../services/userService");

// =================== Registrar usuario ===================
const register = async (req, res) => {
  const { name, surname, email, password } = req.body;

  if (!(name && surname && email && password)) {
    return res
      .status(400)
      .send({ errMessage: "Por favor llena todos los campos requeridos" });
  }

  try {
    const result = await userService.registerUser(req.body);
    return res.status(201).send(result);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// =================== Login usuario ===================
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!(email && password)) {
    return res.status(400).send({ errMessage: "Faltan credenciales" });
  }

  try {
    const user = await userService.loginUser({ email, password });

    // Generar token JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Responder sin enviar el password
    const { _id, name, surname } = user;
    return res.status(200).send({
      message: "Login exitoso",
      token,
      user: { _id, name, surname, email },
    });
  } catch (err) {
    return res.status(401).send(err);
  }
};

// =================== Obtener usuario por ID ===================
const getUser = async (req, res) => {
  try {
    const user = await userService.getUser(req.params.id);
    const { _id, name, surname, email } = user;
    return res.status(200).send({ _id, name, surname, email });
  } catch (err) {
    return res.status(404).send(err);
  }
};

// =================== Obtener usuario por email ===================
const getUserWithMail = async (req, res) => {
  try {
    const user = await userService.getUserWithMail(req.params.email);
    const { _id, name, surname, email } = user;
    return res.status(200).send({ _id, name, surname, email });
  } catch (err) {
    return res.status(404).send(err);
  }
};

module.exports = {
  register,
  login,
  getUser,
  getUserWithMail,
};

