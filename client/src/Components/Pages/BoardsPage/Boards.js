import LoadingScreen from "../../LoadingScreen";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBoards } from "../../../Services/boardsService";
import Navbar from "../../Navbar";
import { Container, Wrapper, Title, Board, AddBoard } from "./Styled";
import CreateBoard from "../../Modals/CreateBoardModal/CreateBoard";
import { useHistory } from "react-router";

const Boards = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  // ✅ USAR SOLO EL ESTADO DE REDUX
  const { pending, boardsData, creating } = useSelector((state) => state.boards);
  const { userInfo, token } = useSelector((state) => state.user);
  
  // Estados locales para UI
  const [openModal, setOpenModal] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [memberFilter, setMemberFilter] = useState([]);

  // ✅ FUNCIÓN PARA CERRAR EL MODAL
  const handleModalClose = () => {
    console.log("🔄 Cerrando modal y recargando tableros");
    setOpenModal(false);
    // Recargar tableros después de crear uno nuevo
    getBoards(false, dispatch);
  };

  // ✅ FUNCIÓN PARA CREAR TABLERO
  const handleCreateBoard = () => {
    console.log("🚀 Abriendo modal para crear nuevo tablero");
    setOpenModal(true);
  };

  // ✅ CARGAR TABLEROS AL MONTAR EL COMPONENTE
  useEffect(() => {
    console.log("🔍 Boards - userInfo:", userInfo);
    console.log("🔍 Boards - token:", token ? "Presente" : "Ausente");
    console.log("🔍 Boards - boardsData:", boardsData);
    
    // Cargar tableros usando el servicio Redux
    getBoards(false, dispatch);
  }, [dispatch]);

  // ✅ FUNCIÓN PARA MANEJAR CLICK EN TABLERO
  const handleClick = (e) => {
    const boardId = e.target.id || e.currentTarget.id;
    console.log("🔗 Navegando al tablero:", boardId);
    if (boardId && boardId !== 'undefined') {
      history.push(`/board/${boardId}`);
    }
  };

  // ✅ MOSTRAR LOADING MIENTRAS ESTÁ PENDIENTE O CREANDO
  if (pending && !Array.isArray(boardsData)) {
    return (
      <>
        <Navbar 
          searchString={searchString}
          setSearchString={setSearchString}
          memberFilter={memberFilter}
          setMemberFilter={setMemberFilter}
        />
        <Container>
          <LoadingScreen />
          <Title>{creating ? "Creando tablero..." : "Cargando tableros..."}</Title>
        </Container>
      </>
    );
  }

  // ✅ OBTENER TABLEROS FILTRADOS
  const filteredBoards = Array.isArray(boardsData) 
    ? boardsData.filter(item => 
        searchString 
          ? item.title?.toLowerCase().includes(searchString.toLowerCase())
          : true
      )
    : [];

  return (
    <>
      {creating && <LoadingScreen />}
      <Navbar 
        searchString={searchString}
        setSearchString={setSearchString}
        memberFilter={memberFilter}
        setMemberFilter={setMemberFilter}
      />
      <Container>
        <Title>Tus Tableros</Title>
        <Wrapper>
          {/* ✅ TABLEROS EXISTENTES */}
          {filteredBoards.map((board) => (
            <Board
              key={board._id}
              id={board._id}
              onClick={handleClick}
              isImage={board.backgroundImageLink ? true : false}
              link={board.backgroundImageLink || board.backgroundColor || "#0079bf"}
            >
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '1rem',
                textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                pointerEvents: 'none'
              }}>
                {board.title || 'Sin título'}
              </div>
            </Board>
          ))}

          {/* ✅ BOTÓN PARA CREAR NUEVO TABLERO */}
          {!pending && (
            <AddBoard onClick={handleCreateBoard}>
              Crear nuevo tablero
            </AddBoard>
          )}

          {/* ✅ TABLERO DE EJEMPLO SI NO HAY TABLEROS */}
          {!pending && filteredBoards.length === 0 && (
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

          {/* ✅ MODAL PARA CREAR TABLERO */}
          {openModal && <CreateBoard callback={handleModalClose} />}
        </Wrapper>
      </Container>
    </>
  );
};

export default Boards;
