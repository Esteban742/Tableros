// src/Services/boardsService.js
import api from './api';
import { openAlert } from '../Redux/Slices/alertSlice';
import {
  failFetchingBoards,
  startFetchingBoards,
  successFetchingBoards,
  startCreatingBoard,
  successCreatingBoard,
  failCreatingBoard,
} from '../Redux/Slices/boardsSlice';
import { addNewBoard } from '../Redux/Slices/userSlice';
import { setLoading, successFetchingBoard, updateTitle } from '../Redux/Slices/boardSlice';

// Obtener todos los tableros
export const getBoards = async (fromDropDown, dispatch) => {
  if (!fromDropDown) dispatch(startFetchingBoards());
  try {
    const res = await api.get('/board');
    setTimeout(() => {
      dispatch(successFetchingBoards({ boards: res.data }));
    }, 1000);
  } catch (error) {
    dispatch(failFetchingBoards());
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage || error.message,
        severity: 'error',
      })
    );
  }
};

// Crear un nuevo tablero
export const createBoard = async (props, dispatch) => {
  dispatch(startCreatingBoard());
  if (!props.title || !props.backgroundImageLink) {
    dispatch(failCreatingBoard());
    dispatch(
      openAlert({
        message: 'Please enter a title and background for the board!',
        severity: 'warning',
      })
    );
    return;
  }

  try {
    const res = await api.post('/board/create', props);
    dispatch(addNewBoard(res.data));
    dispatch(successCreatingBoard(res.data));
    dispatch(
      openAlert({
        message: `${res.data.title} board has been successfully created`,
        severity: 'success',
      })
    );
  } catch (error) {
    dispatch(failCreatingBoard());
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage || error.message,
        severity: 'error',
      })
    );
  }
};

// Obtener un tablero específico
export const getBoard = async (boardId, dispatch) => {
  dispatch(setLoading(true));
  try {
    const res = await api.get(`/board/${boardId}`);
    dispatch(successFetchingBoard(res.data));
    setTimeout(() => {
      dispatch(setLoading(false));
    }, 1000);
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage || error.message,
        severity: 'error',
      })
    );
  }
};

// Actualizar título del tablero
export const boardTitleUpdate = async (title, boardId, dispatch) => {
  try {
    dispatch(updateTitle(title));
    await api.put(`/board/${boardId}/update-board-title`, { title });
  } catch (error) {
    dispatch(
      openAlert({
        message: error?.response?.data?.errMessage || error.message,
        severity: 'error',
      })
    );
  }
};

