
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import setBearer from "../../../Utils/setBearer";

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const fetchBoards = async () => {
      if (!user || !user.token) {
        setLoading(false);
        return;
      }

      setBearer(user.token); // aseguramos que Axios tenga el token

      try {
        const res = await axios.get("https://tableros-53ww.onrender.com/api/boards");
        setBoards(res.data);
      } catch (error) {
        console.error("❌ Error al cargar tableros:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [user]);

  if (loading) return <div>Cargando tableros...</div>;

  return (
    <div>
      <h1>Mis Tableros</h1>
      {boards.map((board) => (
        <div key={board._id}>{board.title}</div>
      ))}
    </div>
  );
};

export default Boards;
