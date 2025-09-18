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
      
      console.log("🔑 Iniciando proceso de login...");
      
      // 🔑 Login (ahora retorna la respuesta)
      const loginResponse = await login(normalizedData, dispatch);
      
      console.log("✅ Login exitoso, respuesta:", loginResponse);
      
      // 🔑 Cargar usuario logueado en Redux
      console.log("📥 Cargando información del usuario...");
      const userLoaded = await loadUser(dispatch);
      
      if (!userLoaded) {
        throw new Error("No se pudo cargar la información del usuario");
      }
      
      console.log("✅ Usuario cargado correctamente:", userLoaded);
      
      // ✅ Mostrar mensaje de éxito y redirigir
      dispatch(openAlert({ 
        message: "¡Bienvenido! Redirigiendo a tableros...", 
        severity: "success",
        duration: 1500
      }));
      
      // Pequeño delay para que el usuario vea el mensaje
      setTimeout(() => {
        console.log("🚀 Redirigiendo a /boards");
        history.push("/boards");
      }, 500);
      
    } catch (err) {
      console.error("❌ Error en proceso de login:", err);
      
      // Limpiar datos en caso de error
      localStorage.removeItem("token");
      setBearer(null);
      
      // El error ya se maneja en userService con dispatch(openAlert)
      // Solo necesitamos hacer cleanup aquí
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

