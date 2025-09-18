import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { login, loadUser } from "../../../Services/userService";
import setBearer from "../../../Utils/setBearer";
import { openAlert } from "../../../Redux/Slices/alertSlice";
import Background from "../../Background";
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

const Login = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { pending } = useSelector((state) => state.user);
  const [userInformations, setUserInformations] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInformations.email || !userInformations.password) {
      dispatch(openAlert({ message: "Por favor completa todos los campos", severity: "warning" }));
      return;
    }

    try {
      const normalizedData = {
        email: userInformations.email.trim().toLowerCase(),
        password: userInformations.password,
      };

      console.log("🔑 Iniciando login...");

      const loginResponse = await login(normalizedData, dispatch);

      // ⚠️ Importante: usar loginResponse.user.token según tu backend
      if (!loginResponse?.user?.token) {
        throw new Error("No se recibió token en la respuesta");
      }

      // Guardar token
      const token = loginResponse.user.token;
      localStorage.setItem("token", token);
      setBearer(token);

      // Cargar info de usuario en Redux
      const userLoaded = await loadUser(dispatch);
      if (!userLoaded) throw new Error("No se pudo cargar la información del usuario");

      dispatch(openAlert({
        message: `¡Bienvenido ${userLoaded.name}! Redirigiendo a tableros...`,
        severity: "success",
        duration: 1500,
      }));

      history.push("/boards");

    } catch (err) {
      console.error("❌ Error en login:", err);

      localStorage.removeItem("token");
      setBearer(null);

      dispatch(openAlert({
        message: err.message || "Error al iniciar sesión",
        severity: "error",
      }));
    }
  };

  return (
    <>
      <BgContainer><Background /></BgContainer>
      <Container>
        <TrelloIconContainer onClick={() => history.push("/")}>
          <Icon src="https://i.postimg.cc/6Qj1y8hB/logok.png" />
        </TrelloIconContainer>
        <FormSection>
          <FormCard>
            <Form onSubmit={handleSubmit}>
              <Title>Iniciar Sesión</Title>
              <Input
                type="email"
                placeholder="Correo Electrónico"
                required
                value={userInformations.email}
                onChange={(e) => setUserInformations({ ...userInformations, email: e.target.value })}
              />
              <Input
                type="password"
                placeholder="Contraseña"
                required
                value={userInformations.password}
                onChange={(e) => setUserInformations({ ...userInformations, password: e.target.value })}
              />
              <Button type="submit" disabled={pending}>
                {pending ? "Ingresando..." : "Ingresar"}
              </Button>
              <Hr />
              <Link fontSize="0.85rem" onClick={() => history.push("/register")}>
                ¿No tienes una cuenta? Registrarse
              </Link>
            </Form>
          </FormCard>
        </FormSection>
      </Container>
    </>
  );
};

export default Login;


