import axios from "axios";
import {
  registrationStart,
  registrationEnd,
  loginStart,
  loginFailure,
  loginSuccess,
  loadStart,
  loadSuccess,
  loadFailure,
  fetchingStart,
  fetchingFinish,
} from "../Redux/Slices/userSlice";
import { openAlert } from "../Redux/Slices/alertSlice";
import setBearer from "../Utils/setBearer";

// Base URL dinámico según entorno
const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://trello-clone-mern-ggrz.onrender.com/user/"
    : "http://localhost:3001/user/";

// =======================================
// Registro
// =======================================
export const register = async (data, dispatch) => {
  dispatch(registrationStart());

  if (data.password !== data.repassword) {
    dispatch(openAlert({ message: "Passwords do not match!", severity: "error" }));
    dispatch(registrationEnd());
    return;
  }

  try {
    const res = await axios.post(`${baseUrl}register`, data);
    dispatch(
      openAlert({
        message: res.data.message,
        severity: "success",
        nextRoute: "/login",
        duration: 1500,
      })
    );
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage || error.message,
        severity: "error",
      })
    );
  }

  dispatch(registrationEnd());
};

// =======================================
// Login
// =======================================
export const login = async ({ email, password }, dispatch) => {
  dispatch(loginStart());

  try {
    const res = await axios.post(`${baseUrl}login`, { email, password });
    const { user, message } = res.data;

    // Guardar token en localStorage y configurar axios
    localStorage.setItem("token", user.token);
    setBearer(user.token);

    dispatch(loginSuccess({ user }));
    dispatch(openAlert({ message, severity: "success", nextRoute: "/boards" }));
  } catch (error) {
    dispatch(loginFailure());
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage || error.message,
        severity: "error",
      })
    );
  }
};

// =======================================
// Cargar usuario logueado
// =======================================
export const loadUser = async (dispatch) => {
  dispatch(loadStart());

  const token = localStorage.getItem("token");
  if (!token) {
    dispatch(loadFailure());
    return;
  }

  // Configurar axios con token
  setBearer(token);

  try {
    const res = await axios.get(`${baseUrl}get-user`);
    dispatch(loadSuccess({ user: res.data }));
  } catch (error) {
    dispatch(loadFailure());
  }
};

// =======================================
// Obtener usuario por email
// =======================================
export const getUserFromEmail = async (email, dispatch) => {
  dispatch(fetchingStart());

  if (!email) {
    dispatch(openAlert({ message: "Please write an email to invite", severity: "warning" }));
    dispatch(fetchingFinish());
    return null;
  }

  const token = localStorage.getItem("token");
  if (token) setBearer(token); // Asegurarse de usar token actual

  try {
    const res = await axios.post(`${baseUrl}get-user-with-email`, { email });
    dispatch(fetchingFinish());
    return res.data;
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage || error.message,
        severity: "error",
      })
    );
    dispatch(fetchingFinish());
    return null;
  }
};

