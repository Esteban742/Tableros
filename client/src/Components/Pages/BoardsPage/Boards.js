import LoadingScreen from "../../LoadingScreen";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBoards } from "../../../Services/boardsService";
import Navbar from "../../Navbar";
import { Container, Wrapper, Title, Board, AddBoard } from "./Styled";
import CreateBoard from "../../Modals/CreateBoardModal/CreateBoard";
import { useHistory } from "react-router";
import axios from "axios";
import setBearer from "../../../Utils/setBearer";

const Boards = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ ESTADO PARA EL MODAL (esto faltaba en producción)
  const [openModal, setOpenModal] = useState(false);
  
  // Estados para props del Navbar
  const [searchString, setSearchString] = useState("");
  const [memberFilter, setMemberFilter] = useState([]);
  
  const { userInfo, token } = useSelector((state) => state.user);

  // ✅ FUNCIÓN PARA CERRAR EL MODAL
  const handleModalClose = () => {
    setOpenModal(false);
    // Recargar tableros después de crear uno nuevo
    fetchBoards();
  };

  // ✅ FUNCIÓN PARA CREAR TABLERO (corregida)
  const handleCreateBoard = () => {
    console.log("🚀 Abriendo modal para crear nuevo tablero");
    setOpenModal(true);
  };

  // ✅ FUNCIÓN SEPARADA PARA CARGAR TABLEROS
  const fetchBoards = async () => {
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

  useEffect(() => {
    console.log("🔍 Boards - userInfo:", userInfo);
    console.log("🔍 Boards - token:", token ? "Presente" : "Ausente");
    
    fetchBoards();
  }, [userInfo, token]);

  // ✅ FUNCIÓN PARA NAVEGAR AL TABLERO (mejorada)
  const handleBoardClick = (boardId) => {
    console.log("🔗 Navegando al tablero:", boardId);
    history.push(`/board/${boardId}`);
  };

  // ✅ FUNCIÓN PARA MANEJAR CLICK EN TABLERO (compatible con código A)
  const handleClick = (e) => {
    const boardId = e.target.id || e.currentTarget.id;
    if (boardId) {
      handleBoardClick(boardId);
    }
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
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  fetchBoards();
                }}
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
          {/* ✅ TABLEROS EXISTENTES con filtro de búsqueda */}
          {boards
            .filter(item => 
              searchString 
                ? item.title?.toLowerCase().includes(searchString.toLowerCase())
                : true
            )
            .map((board) => (
              <Board
                key={board._id}
                id={board._id}
                onClick={handleClick}
                isImage={board.backgroundImage || board.backgroundImageLink ? true : false}
                link={board.backgroundImageLink || board.backgroundImage || board.backgroundColor || "#0079bf"}
              >
                <div style={{ 
                  fontWeight: 'bold', 
                  fontSize: '1rem',
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  pointerEvents: 'none' // Evita conflictos con el onClick
                }}>
                  {board.title || 'Sin título'}
                </div>
              </Board>
            ))}

          {/* ✅ BOTÓN PARA CREAR NUEVO TABLERO (corregido) */}
          <AddBoard onClick={handleCreateBoard}>
            Crear nuevo tablero
          </AddBoard>

          {/* ✅ TABLERO PRINCIPAL DE EJEMPLO (solo si no hay tableros) */}
          {boards.length === 0 && (
            <Board
              id="ejemplo-principal"
              onClick={() => console.log("Tablero principal clickeado - ejemplo")}
              isImage={true}
              link="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            >
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '1rem',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                pointerEvents: 'none'
              }}>
                PRINCIPAL
              </div>
            </Board>
          )}

          {/* ✅ MODAL PARA CREAR TABLERO (esto faltaba en producción) */}
          {openModal && <CreateBoard callback={handleModalClose} />}
        </Wrapper>
      </Container>
    </>
  );
};

export default Boards;
