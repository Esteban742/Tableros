const bcrypt = require("bcryptjs");
const userService = require("../services/userService");
const tokenMiddleware = require("../middlewares/verifyTokenWrapper.js");


const register = async (req, res) => {
  const { name, surname, email, password } = req.body;
  if (!(name && surname && email && password)) {
    return res
      .status(400)
      .send({ errMessage: "Please fill all required areas!" });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  req.body.password = hashedPassword;

  try {
    const result = await userService.registerUser(req.body);
    return res.status(201).send(result);
  } catch (err) {
    return res.status(400).send(err);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res
      .status(400)
      .send({ errMessage: "Please fill all required areas!" });
  }

  try {
    const result = await userService.loginUser({ email, password });
    
    // Aquí asumimos que result trae la password hasheada
    const hashedPassword = result.password;
    if (!bcrypt.compareSync(password, hashedPassword)) {
      return res
        .status(400)
        .send({ errMessage: "Your email/password is wrong!" });
    }

    result.token = auth.generateToken(result._id.toString(), result.email);
    result.password = undefined;
    result.__v = undefined;

    return res
      .status(200)
      .send({ message: "User login successful!", user: result });
  } catch (err) {
    return res.status(400).send(err);
  }
};

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
