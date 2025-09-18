const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // ✅


// =================== Registro ===================
exports.register = async (req, res) => {
  try {
    console.log("📩 Datos recibidos en register:", req.body);

    const { name, surname, email, password } = req.body;

    // Verificar si ya existe el usuario
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ Usuario ya existe:", email);
      return res.status(400).json({ errMessage: "El usuario ya existe" });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      surname, // 👈 agregado
      email,
      password: hashedPassword,
    });

    await newUser.save();
    console.log("✅ Usuario guardado en DB:", newUser);

    res.status(201).json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.log("❌ Error en register:", error);
    res.status(500).json({ errMessage: "Error al registrar usuario" });
  }
};

// =================== Login ===================
exports.login = async (req, res) => {
  try {
    console.log("📩 Datos recibidos en login:", req.body);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ Usuario no encontrado:", email);
      return res.status(400).json({ errMessage: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Contraseña incorrecta para:", email);
      return res.status(400).json({ errMessage: "Credenciales inválidas" });
    }

    // Generar token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    console.log("✅ Login exitoso:", email);

    res.json({
      message: "Login exitoso",
      user: { _id: user._id, name: user.name, surname: user.surname, email: user.email, token },
    });
  } catch (error) {
    console.log("❌ Error en login:", error);
    res.status(500).json({ errMessage: "Error al iniciar sesión" });
  }
};

// =================== Obtener usuario con token ===================
exports.getUser = async (req, res) => {
  try {
    console.log("🔑 Verificando usuario con token:", req.user);
    
    // ✅ Validación adicional (por si acaso)
    if (!req.user || !req.user.id) {
      console.log("❌ Token inválido o req.user undefined");
      return res.status(401).json({ 
        success: false,
        errMessage: "Token inválido o expirado" 
      });
    }
    
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      console.log("❌ Usuario no encontrado con ID:", req.user.id);
      return res.status(404).json({ 
        success: false,
        errMessage: "Usuario no encontrado" 
      });
    }
    
    console.log("✅ Usuario encontrado:", user.email);
    res.json({
      success: true,
      user: user
    });
    
  } catch (error) {
    console.log("❌ Error en getUser:", error);
    res.status(500).json({ 
      success: false,
      errMessage: "Error al obtener usuario" 
    });
  }
};

// =================== Obtener usuario por email ===================
exports.getUserWithMail = async (req, res) => {
  try {
    console.log("📩 Buscando usuario con email:", req.body.email);

    const { email } = req.body;
    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      console.log("❌ Usuario no encontrado con email:", email);
      return res.status(404).json({ errMessage: "Usuario no encontrado" });
    }

    console.log("✅ Usuario encontrado con email:", email);
    res.json(user);
  } catch (error) {
    console.log("❌ Error en getUserWithMail:", error);
    res.status(500).json({ errMessage: "Error al obtener usuario por email" });
  }
};
