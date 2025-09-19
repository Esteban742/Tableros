import axios from "axios";
import { openAlert } from "../Redux/Slices/alertSlice";
import { setLoading, successCreatingCard, deleteCard } from "../Redux/Slices/listSlice";

// Base URL dinámico
const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://tableros-53ww.onrender.com/api/card"
    : "http://localhost:3001/api/cards";

export const createCard = async (title, listId, boardId, dispatch) => {
  dispatch(setLoading(true));
  try {
    const updatedList = await axios.post(`${baseUrl}/create`, {
      title,
      listId,
      boardId,
    });
    dispatch(
      successCreatingCard({
        listId,
        updatedList: updatedList.data,
      })
    );
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    dispatch(
      openAlert({
        message:
          error?.response?.data?.errMessage || error.message,
        severity: "error",
      })
    );
  }
};

export const cardDelete = async (listId, boardId, cardId, dispatch) => {
  try {
    await dispatch(deleteCard({ listId, cardId }));
    await axios.delete(`${baseUrl}/${boardId}/${listId}/${cardId}/delete-card`);
  } catch (error) {
    dispatch(
      openAlert({
        message:
          error?.response?.data?.errMessage || error.message,
        severity: "error",
      })
    );
  }
};

