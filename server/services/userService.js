const axios = require("axios");

// Base URL de tu API desplegada
const API_URL = "https://tableros-53ww.onrender.com/api/users";

const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    // Retorna el mensaje de error para mostrarlo en la UI
    throw error.response?.data || { errMessage: "Error desconocido" };
  }
};

const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { errMessage: "Error desconocido" };
  }
};

module.exports = {
  registerUser,
  loginUser
};
