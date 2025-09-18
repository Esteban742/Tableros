import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import setBearer from "../../../Utils/setBearer";
import Navbar from "../Navbar";
import { Container, Title, Wrapper, Board, AddBoard } from "./Styled";

const Boards = () => {
  const history = useHistory();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para props del Navbar
  const [searchString, setSearchString] = useState("");
  const [memberFilter, setMemberFilter] = useState([]);
  
  // Corregido: usar userInfo en lugar de currentUser
  const { userInfo, token } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("🔍 Boards - userInfo:", userInfo);
    console.log("🔍 Boards - token:", token ? "Presente" : "Ausente");
    
    const fetchBoards = async () => {
      // Usar token del Redux state o localStorage como backup
      const authToken = token || localStorage.getItem("token");
      
      if (!authToken) {
        console.log("❌ No hay token para cargar tableros");
        setError("No se encontró token de autenticación");
        setLoading(false);
        return;
      }
      
      setBearer(authToken);
      
      try {
        console.log("📤 Cargando tableros desde API...");
        const res = await axios.get("/api/boards");
        console.log("📥 Tableros recibidos:", res.data);
        setBoards(res.data || []);
        setError(null);
      } catch (error) {
        console.error("❌ Error al cargar tableros:", error.response?.data || error.message);
        setError(error.response?.data?.message || error.message || "Error al cargar tableros");
      } finally {
        setLoading(false);
      }
    };
    
    fetchBoards();
  }, [userInfo, token]);

  const handleBoardClick = (boardId) => {
    console.log("Navegando al tablero:", boardId);
    history.push(`/board/${boardId}`);
  };

  const handleCreateBoard = () => {
    console.log("Crear nuevo tablero - funcionalidad por implementar");
    // Aquí implementarías la lógica para crear un nuevo tablero
    // Por ejemplo, abrir un modal o navegar a una página de creación
  };

  if (loading) {
    return (
      <>
        <Navbar 
          searchString={searchString}
          setSearchString={setSearchString}
          memberFilter={memberFilter}
          setMemberFilter={setMemberFilter}
        />
        <Container>
          <Title>Cargando tableros...</Title>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar 
          searchString={searchString}
          setSearchString={setSearchString}
          memberFilter={memberFilter}
          setMemberFilter={setMemberFilter}
        />
        <Container>
          <Title>Error al cargar tableros</Title>
          <Wrapper>
            <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
              <p>{error}</p>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Reintentar
              </button>
            </div>
          </Wrapper>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar 
        searchString={searchString}
        setSearchString={setSearchString}
        memberFilter={memberFilter}
        setMemberFilter={setMemberFilter}
      />
      <Container>
        <Title>Tus Tableros</Title>
        <Wrapper>
          {/* Tableros existentes */}
          {boards.map((board) => (
            <Board
              key={board._id}
              onClick={() => handleBoardClick(board._id)}
              isImage={board.backgroundImage ? true : false}
              link={board.backgroundImage || board.backgroundColor || "#0079bf"}
            >
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '1rem',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              }}>
                {board.title || 'Sin título'}
              </div>
            </Board>
          ))}

          {/* Botón para crear nuevo tablero */}
          <AddBoard onClick={handleCreateBoard}>
            Crear nuevo tablero
          </AddBoard>

          {/* Si no hay tableros, mostrar un tablero principal como ejemplo */}
          {boards.length === 0 && (
            <Board
              onClick={() => console.log("Tablero principal clickeado")}
              isImage={true}
              link="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            >
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '1rem',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
              }}>
                PRINCIPAL
              </div>
            </Board>
          )}
        </Wrapper>
      </Container>
    </>
  );
};

export default Boards;
