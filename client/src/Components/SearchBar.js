import React, { useState } from "react";
import styled from "styled-components";
import { sm, xs } from "../BreakPoints";
import SearchIcon from "../Images/search-icon.svg";
import { useSelector } from "react-redux";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row; /* cambia a column si quieres que queden uno arriba del otro */
  gap: 0.5rem;
  align-items: center;
`;

/* Barra de búsqueda */
const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.3rem;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.3);
  height: 2rem;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 0.1rem 0.5rem;
  color: white;
  width: 15rem;
  min-width: 6rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.4);
  }

  ${sm({
    width: "10rem",
  })}
  ${xs({
    width: "26.8vw",
  })}
`;

const Input = styled.input`
  box-sizing: content-box;
  font-size: 0.85rem;
  border: none;
  color: white;
  background-color: transparent;
  outline: none;
  height: 1rem;
  overflow: hidden;

  &::placeholder {
    color: white;
  }

  &:focus {
    font-weight: 600;
    &::placeholder {
      color: transparent;
    }
  }
`;

const Icon = styled.img`
  width: 24px;
  height: 24px;
  ${xs({
    width: "20px",
    height: "20px",
  })}
`;

/* Dropdown personalizado */
const Dropdown = styled.div`
  position: relative;
  width: 12rem;
`;

const DropdownButton = styled.button`
  width: 100%;
  height: 2rem;
  background: rgba(255, 255, 255, 0.3);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 3px;
  cursor: pointer;
  text-align: left;
  padding: 0 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 2.2rem;
  left: 0;
  width: 100%;
  background: #333c87;
  border-radius: 3px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 10;
`;

const DropdownItem = styled.li`
  padding: 0.5rem;
  color: white;
  cursor: pointer;

  &:hover {
    background: #f4a020; /* Aquí sí cambia el hover */
  }
`;

const SearchBar = (props) => {
  const { searchString, setSearchString, memberFilter, setMemberFilter } = props;
  const members = useSelector((state) => state.board.members || []);
  const [open, setOpen] = useState(false);

  return (
    <Wrapper>
      {/* Barra de búsqueda */}
      <Container>
        <Icon src={SearchIcon} />
        <Input
          placeholder="Buscar..."
          value={searchString}
          onChange={(e) => setSearchString(e.target.value)}
        />
      </Container>

      {/* Dropdown personalizado */}
      <Dropdown>
        <DropdownButton onClick={() => setOpen(!open)}>
          {memberFilter
            ? members.find((m) => m.user === memberFilter)?.name
            : "Todos"}
        </DropdownButton>
        {open && (
          <DropdownList>
            <DropdownItem
              onClick={() => {
                setMemberFilter(null);
                setOpen(false);
              }}
            >
              Todos
            </DropdownItem>
            {members.map((m) => (
              <DropdownItem
                key={m.user}
                onClick={() => {
                  setMemberFilter(m.user);
                  setOpen(false);
                }}
              >
                {m.name}
              </DropdownItem>
            ))}
          </DropdownList>
        )}
      </Dropdown>
    </Wrapper>
  );
};

export default SearchBar;
