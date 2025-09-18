
import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../Services/userService";
import setBearer from "./setBearer";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  
  // ✅ CORREGIDO: usar userInfo e isAuthenticated del state
  const { userInfo, isAuthenticated, pending } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    console.log("🔒 ProtectedRoute - Token:", token ? "Presente" : "Ausente");
    console.log("🔒 ProtectedRoute - userInfo:", userInfo);
    console.log("🔒 ProtectedRoute - isAuthenticated:", isAuthenticated);
    
    if (!token) {
      console.log("❌ No hay token, redirigiendo al login");
      setLoading(false);
      return;
    }

    // Si ya tenemos usuario autenticado, no volver a cargar
    if (isAuthenticated && userInfo) {
      console.log("✅ Usuario ya autenticado:", userInfo.name);
      setLoading(false);
      return;
    }

    setBearer(token);
    
    // Cargar usuario y esperar a que termine
    (async () => {
      console.log("📥 Cargando usuario en ProtectedRoute...");
      const user = await loadUser(dispatch);
      console.log("✅ Usuario cargado en ProtectedRoute:", user ? "Éxito" : "Falló");
      setLoading(false);
    })();
  }, [dispatch, userInfo, isAuthenticated]);

  // Mostrar loading mientras se verifica autenticación
  if (loading || pending) {
    console.log("⏳ ProtectedRoute - Mostrando loading...");
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Cargando...
      </div>
    );
  }

  // ✅ CORREGIDO: verificar isAuthenticated Y userInfo
  const isUserAuthenticated = isAuthenticated && userInfo && (userInfo._id || userInfo.id);
  
  console.log("🔒 ProtectedRoute - ¿Usuario autenticado?", isUserAuthenticated);
  
  return (
    <Route
      {...rest}
      render={(props) =>
        isUserAuthenticated ? (
          <>
            {console.log("✅ Renderizando componente protegido para:", userInfo.name)}
            <Component {...props} />
          </>
        ) : (
          <>
            {console.log("❌ Redirigiendo al login - Usuario no autenticado")}
            <Redirect to="/login" />
          </>
        )
      }
    />
  );
};

export default ProtectedRoute;
