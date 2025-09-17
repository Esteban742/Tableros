// server/services/userService.js
const User = require("../models/userModel"); // Asegúrate de tener el modelo User definido
const bcrypt = require("bcryptjs");

// =================== Registrar usuario ===================
const registerUser = async ({ name, surname, email, password }) => {
  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw { errMessage: "El correo ya está registrado" };
  }

  // Crear usuario con password hasheada
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const user = new User({
    name,       // coincide con tu schema
    surname,    // coincide con tu schema
    email,
    password: hashedPassword,
  });

  await user.save();

    // 👇 Aquí puedes poner un log para confirmar
  console.log("✅ Usuario registrado en la BD:", user);

  // Retornar solo la información pública
  const { _id } = user;
  return { message: "Usuario registrado exitosamente", user: { _id, name, surname, email } };
};

// =================== Login usuario ===================
const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw { errMessage: "Email o contraseña incorrectos" };

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) throw { errMessage: "Email o contraseña incorrectos" };

  return user; // Aquí el controller agregará el token y ocultará password
};

// =================== Obtener usuario por ID ===================
const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw { errMessage: "Usuario no encontrado" };
  return user;
};

// =================== Obtener usuario por email ===================
const getUserWithMail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw { errMessage: "Usuario no encontrado" };
  return user;
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getUserWithMail,
};

