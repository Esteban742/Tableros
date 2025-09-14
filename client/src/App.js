import axios from "axios";
import {
  registrationStart,
  registrationEnd,
  loginStart,
  loginFailure,
  loginSuccess,
  loadSuccess,
  loadFailure,
  loadStart,
  fetchingStart,
  fetchingFinish,
} from "../Redux/Slices/userSlice";
import { openAlert } from "../Redux/Slices/alertSlice";
import setBearer from "./Utils/setBearer";


// Base URL dinámico según entorno
const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://trello-clone-mern-ggrz.onrender.com/user/"
    : "http://localhost:3001/user/";

// Registro
export const register = async (
  { name, surname, email, password, repassword },
  dispatch
) => {
  dispatch(registrationStart());
  if (password !== repassword) {
    dispatch(
      openAlert({
        message: "Your passwords do not match!",
        severity: "error",
      })
    );
  } else {
    try {
      const res = await axios.post(`${baseUrl}register`, {
        name,
        surname,
        email,
        password,
      });
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
          message: error?.response?.data?.errMessage
            ? error.response.data.errMessage
            : error.message,
          severity: "error",
        })
      );
    }
  }
  dispatch(registrationEnd());
};

// Login
export const login = async ({ email, password }, dispatch) => {
  dispatch(loginStart());
  try {
    const res = await axios.post(baseUrl + "login", { email, password });
    const { user, message } = res.data;

    // Guardar token y configurar axios
    localStorage.setItem("token", user.token);
    setBearer(user.token);

    dispatch(loginSuccess({ user }));
    dispatch(
      openAlert({
        message,
        severity: "success",
        duration: 500,
        nextRoute: "/boards",
      })
    );
  } catch (error) {
    dispatch(loginFailure());
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage
          ? error.response.data.errMessage
          : error.message,
        severity: "error",
      })
    );
  }
};

// Cargar usuario logueado
export const loadUser = async (dispatch) => {
  dispatch(loadStart());
  const token = localStorage.getItem("token");
  if (!token) return dispatch(loadFailure());

  setBearer(token);

  try {
    const res = await axios.get(baseUrl + "get-user");
    dispatch(loadSuccess({ user: res.data }));
  } catch (error) {
    dispatch(loadFailure());
  }
};

// Obtener usuario por email
export const getUserFromEmail = async (email, dispatch) => {
  dispatch(fetchingStart());
  if (!email) {
    dispatch(
      openAlert({
        message: "Please write an email to invite",
        severity: "warning",
      })
    );
    dispatch(fetchingFinish());
    return null;
  }

  try {
    const res = await axios.post(baseUrl + "get-user-with-email", { email });
    dispatch(fetchingFinish());
    return res.data;
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage
          ? error.response.data.errMessage
          : error.message,
        severity: "error",
      })
    );
    dispatch(fetchingFinish());
    return null;
  }
};

