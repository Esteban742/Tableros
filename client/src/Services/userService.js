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
    
    dispatch(registrationEnd());
    return res.data;
    
  } catch (error) {
    console.log("❌ Error en register frontend:", error.response?.data || error.message);
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage || error.message,
        severity: "error",
      })
    );
    dispatch(registrationEnd());
    throw error;
  }
};

// =================== Login ===================
export const login = async ({ email, password }, dispatch) => {
  dispatch(loginStart());
  
  try {
    console.log("📤 Enviando login a backend:", { email });
    
    const res = await axios.post(`${baseUrl}login`, { email, password });
    
    console.log("📥 Respuesta del backend:", res.data);
    
    const { user, message } = res.data;
    
    if (!user || !user.token) {
      throw new Error("Respuesta del servidor inválida - no se recibió token");
    }
    
    console.log("✅ Token recibido:", user.token.substring(0, 20) + "...");
    
    localStorage.setItem("token", user.token);
    setBearer(user.token);
    dispatch(loginSuccess({ user }));
    dispatch(openAlert({ message, severity: "success" }));
    
    // ✅ RETORNAR LA RESPUESTA
    return res.data;
    
  } catch (error) {
    console.error("❌ Error en login:", error.response?.data || error.message);
    dispatch(loginFailure());
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage || error.message || "Error al iniciar sesión",
        severity: "error",
      })
    );
    // ✅ LANZAR ERROR PARA QUE EL COMPONENTE LO MANEJE
    throw error;
  }
};

// =================== Cargar usuario ===================
export const loadUser = async (dispatch) => {
  dispatch(loadStart());
  
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("❌ No hay token en localStorage");
    dispatch(loadFailure());
    return null;
  }
  
  setBearer(token); // Asegurarse de setear el header antes de la petición
  
  try {
    console.log("📤 Cargando usuario desde backend...");
    const res = await axios.get(`${baseUrl}get-user`);
    console.log("📥 Usuario cargado:", res.data);
    
    dispatch(loadSuccess({ user: res.data }));
    return res.data; // devolver usuario
    
  } catch (error) {
    console.error("❌ Error en loadUser:", error.response?.data || error.message);
    
    // Si el token es inválido, limpiar localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      setBearer(null);
    }
    
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
