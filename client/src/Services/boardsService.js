import axios from "axios";
import { openAlert } from "../Redux/Slices/alertSlice";
import {
  failFetchingBoards,
  startFetchingBoards,
  successFetchingBoards,
  successCreatingBoard,
  failCreatingBoard,
  startCreatingBoard,
} from "../Redux/Slices/boardsSlice";
import { addNewBoard } from "../Redux/Slices/userSlice";
import { setLoading, successFetchingBoard, updateTitle } from "../Redux/Slices/boardSlice";

// ✅ CORREGIDO: URL consistente
const API = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
const baseUrl = `${API}/boards`; // Cambiado de /board a /boards

export const getBoards = async (fromDropDown, dispatch) => {
  console.log("🔍 getBoards - URL completa:", `${baseUrl}`);
  
  if (!fromDropDown) dispatch(startFetchingBoards());
  try {
    console.log("📤 Haciendo GET request a:", baseUrl);
    const res = await axios.get(baseUrl);
    console.log("📥 Respuesta del servidor:", res.data);
    setTimeout(() => dispatch(successFetchingBoards({ boards: res.data })), 1000);
  } catch (error) {
    console.error("❌ Error en getBoards:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: baseUrl
    });
    dispatch(failFetchingBoards());
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};

export const createBoard = async (props, dispatch) => {
  console.log("🚀 createBoard - Datos:", props);
  console.log("🚀 createBoard - URL:", `${baseUrl}/create`);
  
  dispatch(startCreatingBoard());
  
  if (!(props.title && props.backgroundImageLink)) {
    console.warn("⚠️ Faltan datos requeridos:", { title: props.title, backgroundImageLink: props.backgroundImageLink });
    dispatch(failCreatingBoard());
    dispatch(openAlert({
      message: "Please enter a title for board!",
      severity: "warning",
    }));
    return;
  }
  
  try {
    console.log("📤 Creando tablero en:", `${baseUrl}/create`);
    const res = await axios.post(`${baseUrl}/create`, props);
    console.log("✅ Tablero creado:", res.data);
    
    dispatch(addNewBoard(res.data));
    dispatch(successCreatingBoard(res.data));
    dispatch(openAlert({
      message: `${res.data.title} board has been successfully created`,
      severity: "success",
    }));
  } catch (error) {
    console.error("❌ Error creando tablero:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: `${baseUrl}/create`
    });
    dispatch(failCreatingBoard());
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};

export const getBoard = async (boardId, dispatch) => {
  console.log("🔍 getBoard - URL:", `${baseUrl}/${boardId}`);
  
  // ✅ AÑADIDO: Configurar token antes de la petición
  const token = localStorage.getItem("token");
  if (token) {
    console.log("🔑 Configurando token para getBoard");
    setBearer(token);
  } else {
    console.warn("⚠️ No se encontró token para getBoard");
  }
  
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`${baseUrl}/${boardId}`);
    console.log("📥 Tablero individual cargado:", res.data);
    dispatch(successFetchingBoard(res.data));
    setTimeout(() => dispatch(setLoading(false)), 1000);
  } catch (error) {
    console.error("❌ Error cargando tablero individual:", error);
    dispatch(setLoading(false));
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};

export const boardTitleUpdate = async (title, boardId, dispatch) => {
  console.log("📝 Actualizando título del tablero:", { title, boardId });
  
  // ✅ AÑADIDO: Configurar token antes de la petición
  const token = localStorage.getItem("token");
  if (token) {
    setBearer(token);
  }
  
  try {
    dispatch(updateTitle(title));
    await axios.put(`${baseUrl}/${boardId}/update-board-title`, { title });
    console.log("✅ Título actualizado correctamente");
  } catch (error) {
    console.error("❌ Error actualizando título:", error);
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};
