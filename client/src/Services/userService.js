import axios from "axios";
import { loginStart, loginSuccess, loginFailure } from "../Redux/userSlice";

// URL del backend desde .env o localhost
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Registrar usuario
export const register = async (userData, dispatch) => {
  try {
    dispatch(loginStart());
    const res = await axios.post(`${API_URL}/users/register`, userData);
    dispatch(loginSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(loginFailure());
    throw err;
  }
};

// Login usuario
export const login = async (credentials, dispatch) => {
  try {
    dispatch(loginStart());
    const res = await axios.post(`${API_URL}/users/login`, credentials);
    dispatch(loginSuccess(res.data));
    return res.data;
  } catch (err) {
    dispatch(loginFailure());
    throw err;
  }
};


