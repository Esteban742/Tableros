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

// Base URL dinámico
const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://tableros-53ww.onrender.com/api/users/"
    : "http://localhost:3001/api/users/";

// =================== Registro ===================
export const register = async (data, dispatch) => {
  dispatch(registrationStart());

  if (data.password !== data.repassword) {
    dispatch(openAlert({ message: "Las contraseñas no coinciden", severity: "warning" }));
    dispatch(registrationEnd());
    return;
  }

  // 👉 Enviar solo lo que el backend espera
  const payload = {
    name: data.name,
    surname: data.surname,
    email: data.email,
    password: data.password,
  };

  try {
    console.log("📤 Enviando datos a backend:", payload);
    const res = await axios.post(`${baseUrl}register`, payload);
    console.log("📥 Respuesta backend:", res.data);

    dispatch(
      openAlert({
        message: res.data.message || "Usuario registrado exitosamente",
        severity: "success",
        nextRoute: "/login",
        duration: 1500,
      })
    );
  } catch (error) {
    console.log("❌ Error en register frontend:", error.response?.data || error.message);
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage || error.message,
        severity: "error",
      })
    );
  }

  dispatch(registrationEnd());
};

// =================== Login ===================
export const login = async ({ email, password }, dispatch) => {
  dispatch(loginStart());

  try {
    const res = await axios.post(`${baseUrl}login`, { email, password });
    const { user, message } = res.data;

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


// =================== Cargar usuario ===================
export const loadUser = async (dispatch) => {
  dispatch(loadStart());

  const token = localStorage.getItem("token");
  if (!token) {
    dispatch(loadFailure());
    return null; // No hay token, no cargar
  }

  setBearer(token); // Asegurarse de setear el header antes de la petición

  try {
    const res = await axios.get(`${baseUrl}get-user`);
    dispatch(loadSuccess({ user: res.data }));
    return res.data; // devolver usuario
  } catch (error) {
    console.error("❌ Error en loadUser:", error.response?.data || error.message);
    dispatch(loadFailure());
    return null;
  }
};


// =================== Obtener usuario por email ===================
export const getUserFromEmail = async (email, dispatch) => {
  dispatch(fetchingStart());

  if (!email) {
    dispatch(openAlert({ message: "Please write an email to invite", severity: "warning" }));
    dispatch(fetchingFinish());
    return null;
  }

  const token = localStorage.getItem("token");
  if (token) setBearer(token);

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

