// client/src/Services/boardService.js
import axios from "axios";
import {
  setLoading,
  successCreatingList,
  successDeletingList,
  successFetchingLists,
  updateListTitle,
} from "../Redux/Slices/listSlice";
import { openAlert } from "../Redux/Slices/alertSlice";
import {
  addMembers,
  setActivityLoading,
  updateActivity,
  updateBackground,
  updateDescription,
} from "../Redux/Slices/boardSlice";
import { addNewBoard } from "../Redux/Slices/userSlice"; // ✅ import correcto

// Base URL dinámica
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";
const listRoute = `${API_URL}/list`;
const boardRoute = `${API_URL}/board`;

// Obtener listas
export const getLists = async (boardId, dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.get(`${listRoute}/${boardId}`);
    dispatch(successFetchingLists(res.data));
    setTimeout(() => dispatch(setLoading(false)), 300);
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};

// Actualizar actividad
export const activityUpdate = async (boardId, dispatch) => {
  dispatch(setActivityLoading(true));
  try {
    const res = await axios.get(`${boardRoute}/${boardId}/activity`);
    dispatch(updateActivity(res.data));
    dispatch(setActivityLoading(false));
  } catch (error) {
    dispatch(setActivityLoading(false));
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};

// Crear lista
export const createList = async (title, boardId, dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await axios.post(`${listRoute}/create`, { title, boardId });
    dispatch(successCreatingList(res.data));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};

// Eliminar lista
export const DeleteList = async (listId, boardId, dispatch) => {
  dispatch(setLoading(true));
  try {
    await axios.delete(`${listRoute}/${boardId}/${listId}`);
    dispatch(successDeletingList(listId));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};

// Actualizar título de lista
export const listTitleUpdate = async (listId, boardId, title, dispatch) => {
  try {
    dispatch(updateListTitle({ listId, title }));
    await axios.put(`${listRoute}/${boardId}/${listId}/update-title`, { title });
  } catch (error) {
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};

// Actualizar descripción del tablero
export const boardDescriptionUpdate = async (boardId, description, dispatch) => {
  try {
    dispatch(updateDescription(description));
    await axios.put(`${boardRoute}/${boardId}/update-board-description`, { description });
  } catch (error) {
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};

// Actualizar fondo del tablero
export const boardBackgroundUpdate = async (boardId, background, isImage, dispatch) => {
  try {
    dispatch(updateBackground({ background, isImage }));
    await axios.put(`${boardRoute}/${boardId}/update-background`, { background, isImage });
  } catch (error) {
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};

// Agregar miembros al tablero
export const boardMemberAdd = async (boardId, members, dispatch) => {
  try {
    const result = await axios.post(`${boardRoute}/${boardId}/add-member`, { members });
    dispatch(addMembers(result.data));
    dispatch(openAlert({
      message: "Members are added to this board successfully",
      severity: "success",
    }));
  } catch (error) {
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};

// Remover miembro del tablero
export const boardMemberRemove = async (boardId, identifier, dispatch) => {
  try {
    const result = await axios.delete(`${boardRoute}/${boardId}/remove-member`, { data: identifier });
    dispatch(addMembers(result.data));
    dispatch(openAlert({
      message: "Member removed from this board successfully",
      severity: "success",
    }));
  } catch (error) {
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};

// Crear nuevo tablero
export const createBoard = async (title, dispatch) => {
  try {
    const res = await axios.post(`${boardRoute}/create`, { title });
    dispatch(addNewBoard(res.data)); // ✅ se agrega al slice de user
    dispatch(openAlert({
      message: "Tablero creado exitosamente",
      severity: "success",
    }));
  } catch (error) {
    dispatch(openAlert({
      message: error?.response?.data?.errMessage || error.message,
      severity: "error",
    }));
  }
};
