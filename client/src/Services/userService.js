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

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://trello-clone-mern-ggrz.onrender.com/user/"
    : "http://localhost:3001/user/";

// Registro
export const register = async (data, dispatch) => {
  dispatch(registrationStart());
  if (data.password !== data.repassword) {
    dispatch(openAlert({ message: "Passwords do not match!", severity: "error" }));
  } else {
    try {
      const res = await axios.post(`${baseUrl}register`, data);
      dispatch(openAlert({
        message: res.data.message,
        severity: "success",
        nextRoute: "/login",
        duration: 1500,
      }));
    } catch (error) {
      dispatch(openAlert({
        message: error?.response?.data?.errMessage || error.message,
        severity: "error",
      }));
    }
  }
  dispatch(registrationEnd());
};

// Login
export const login = async ({ email, password }, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(`${baseUrl}login`, { email, password });
    const { user, message } = res.data;

    localStorage.setItem("token", user.token); // Guardar token
    setBearer(user.token);                     // Configurar axios

    dispatch(loginSuccess({ user }));
    dispatch(openAlert({ message, severity: "success", nextRoute: "/boards" }));
  } catch (error) {
    dispatch(loginFailure());
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};

// Cargar usuario
export const loadUser = async (dispatch) => {
  dispatch(loadStart());
  const token = localStorage.getItem("token");
  if (!token) return dispatch(loadFailure());

  setBearer(token); // Configura axios con token
  try {
    const res = await axios.get(`${baseUrl}get-user`);
    dispatch(loadSuccess({ user: res.data }));
  } catch (error) {
    dispatch(loadFailure());
  }
};

// Obtener usuario por email
export const getUserFromEmail = async (email, dispatch) => {
  dispatch(fetchingStart());
  if (!email) {
    dispatch(openAlert({ message: "Please write an email to invite", severity: "warning" }));
    dispatch(fetchingFinish());
    return null;
  }
  try {
    const res = await axios.post(`${baseUrl}get-user-with-email`, { email });
    dispatch(fetchingFinish());
    return res.data;
  } catch (error) {
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
    dispatch(fetchingFinish());
    return null;
  }
};


