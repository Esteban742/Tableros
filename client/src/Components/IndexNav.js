import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { lg } from "../BreakPoints";
import logok from "../Images/logok.png";


const Container = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: transparent;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  z-index: 100;

  ${lg({
    justifyContent: "space-between",    
  })}
`;

const Icon = styled.img`
  margin-left: 2rem;
   margin-top: 3rem;
  width: 240px;   /* Ajusta el ancho que quieras */
  height: auto;   /* Mantiene la proporción de la imagen */

  ${lg({
    marginLeft: "0",
    width: "240px", // Puedes definir otro tamaño para pantallas grandes
  })}
`;


const RightSide = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;



const Button = styled.button`
  background-color: #ffa420;
  border-radius: 0.4rem;
  margin-right: 3rem;
  margin-top: 3rem; 
  padding: 0.8rem 2rem;
  color: white;
  border: none;
  cursor: pointer;  
  &:hover {
    background-color:rgb(48, 2, 2);
  }
`;

const IndexNav = () => {
  let history = useHistory();
  return (
    <Container>
      <Icon src={logok} />
      <RightSide>
        <Button onClick={()=>history.push("/login")}>Iniciar Sesión</Button>
        
      </RightSide>
    </Container>
  );
};

export default IndexNav;
