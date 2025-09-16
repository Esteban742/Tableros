const bcrypt = require("bcryptjs");
const userService = require("../services/userService");
const auth = require("../utils/auth"); // <- Asegúrate de tener esta función
const tokenMiddleware = require("../middlewares/verifyTokenWrapper.js");

// =================== Registrar usuario ===================
const register = async (req, res) => {
  const { name, surname, email, password } = req.body;
  if (!(name && surname && email && password)) {
    return res
      .status(400)
      .send({ errMessage: "Please fill all required areas!" });
  }

  try {
    // Llamamos al service, que ya hace el hash
    const result = await userService.registerUser({ name, surname, email, password });
    return res.status(201).send(result);
  } catch (err) {
    return res.status(400).send(err);
  }
};

// =================== Login usuario ===================
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res
      .status(400)
      .send({ errMessage: "Please fill all required areas!" });
  }

  try {
    const user = await userService.loginUser({ email, password });

    // Generar token
    const token = auth.generateToken(user._id.toString(), user.email);
    user.token = token;
    user.password = undefined;
    user.__v = undefined;

    return res
      .status(200)
      .send({ message: "User login successful!", user });
  } catch (err) {
    return res.status(400).send(err);
  }
};

// =================== Obtener usuario por ID ===================
const getUser = async (req, res) => {
  const userId = req.user.id;
  try {
    const result = await userService.getUser(userId);
    result.password = undefined;
    result.__v = undefined;
    return res.status(200).send(result);
  } catch (err) {
    return res.status(404).send(err);
  }
};

// =================== Obtener usuario por email ===================
const getUserWithMail = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await userService.getUserWithMail(email);
    const dataTransferObject = {
      name: result.name,
      surname: result.surname,
      color: result.color,
      email: result.email
    };
    return res.status(200).send(dataTransferObject);
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

