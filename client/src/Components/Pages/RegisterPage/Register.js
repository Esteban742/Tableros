import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { register } from "../../../Services/userService";
import { useDispatch, useSelector } from "react-redux";
import Background from '../../Background';
import { openAlert } from "../../../Redux/Slices/alertSlice"; // <-- import agregado
import {
  BgContainer,
  Container,
  TrelloIconContainer,
  FormSection,
  FormCard,
  Form,
  Title,
  Input,
  Button,
  Icon,
  Hr,
  Link,
} from "./Styled";

const Register = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { pending } = useSelector((state) => state.user);

  const [userInformations, setUserInformations] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    repassword: "",
  });

  useEffect(() => {
    document.title = "Registrar Nuevo Usuario";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
     console.log(userInformations);
    
    // Validación en frontend usando openAlert
    if (userInformations.password !== userInformations.repassword) {
      dispatch(openAlert({ message: "Las contraseñas no coinciden", severity: "warning" }));
      return;
    }

    const userData = {
      username: `${userInformations.name} ${userInformations.surname}`,
      email: userInformations.email,
      password: userInformations.password,
    };

    try {
      await register(userData, dispatch);
      history.push("/"); // redirige después de registrar
    } catch (err) {
      dispatch(openAlert({ message: "Error al registrarse. Verifica los datos.", severity: "error" }));
    }
  };

  return (
    <>
      <BgContainer>
        <Background />
      </BgContainer>
      <Container>
        <TrelloIconContainer onClick={() => history.push("/")}>
          <Icon src="https://i.postimg.cc/6Qj1y8hB/logok.png" />
        </TrelloIconContainer>
        <FormSection>
          <FormCard>
            <Form onSubmit={handleSubmit}>
              <Title>Registrarse</Title>
              <Input
                type="text"
                placeholder="Nombre"
                required
                value={userInformations.name}
                onChange={(e) =>
                  setUserInformations({ ...userInformations, name: e.target.value })
                }
              />
              <Input
                type="text"
                placeholder="Apellido"
                required
                value={userInformations.surname}
                onChange={(e) =>
                  setUserInformations({ ...userInformations, surname: e.target.value })
                }
              />
              <Input
                type="email"
                placeholder="Correo Electrónico"
                required
                value={userInformations.email}
                onChange={(e) =>
                  setUserInformations({ ...userInformations, email: e.target.value })
                }
              />
              <Input
                type="password"
                placeholder="Contraseña"
                required
                value={userInformations.password}
                onChange={(e) =>
                  setUserInformations({ ...userInformations, password: e.target.value })
                }
              />
              <Input
                type="password"
                placeholder="Confirmar Contraseña"
                required
                value={userInformations.repassword}
                onChange={(e) =>
                  setUserInformations({ ...userInformations, repassword: e.target.value })
                }
              />

              <Button type="submit" disabled={pending}>
                Registrar
              </Button>
              <Hr />
              <Link fontSize="0.85rem" onClick={() => history.push("/login")}>
                ¿Ya tienes una cuenta? Iniciar Sesión
              </Link>
            </Form>
          </FormCard>
        </FormSection>
      </Container>
    </>
  );
};

export default Register;




