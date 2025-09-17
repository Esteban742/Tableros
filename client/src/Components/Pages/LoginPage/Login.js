import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    document.title = "Iniciar Sesión";
    // Configurar token si ya existe
    const token = localStorage.getItem("token");
    if (token) {
      setBearer(token);
      loadUser(dispatch); // carga usuario si hay token
    }
  }, [dispatch]);

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

      // Llamar a login y recibir el usuario logueado
      const res = await login(normalizedData, dispatch);

      if (!res || !res.user || !res.user.token) {
        throw new Error("No se pudo iniciar sesión correctamente");
      }

     // Guardar token en localStorage
     localStorage.setItem("token", res.user.token);

     // Configurar Axios con el token
     setBearer(res.user.token);

     // Cargar usuario en Redux y esperar a que termine
     await loadUser(dispatch);

     // Mostrar alerta de éxito
     dispatch(openAlert({ message: "Inicio de sesión exitoso", severity: "success" }));


      // Redirigir al dashboard
      history.push("/boards");
    } catch (err) {
      dispatch(
        openAlert({
          message: err?.response?.data?.errMessage || err.message || "Error al iniciar sesión",
          severity: "error",
        })
      );
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
              <Button type="submit" disabled={pending}>Ingresar</Button>
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



