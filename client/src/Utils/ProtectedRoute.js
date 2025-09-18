import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../Services/userService";
import setBearer from "./setBearer";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const dispatch = useDispatch();
  const { userInfo, isAuthenticated, pending } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    console.log("🔒 ProtectedRoute - Token:", token ? "Presente" : "Ausente");
    console.log("🔒 ProtectedRoute - userInfo:", userInfo);
    console.log("🔒 ProtectedRoute - isAuthenticated:", isAuthenticated);
    console.log("🔒 ProtectedRoute - pending:", pending);
    
    if (!token) {
      console.log("❌ No hay token, redirigiendo al login");
      setLoading(false);
      return;
    }

    setBearer(token);
    
    (async () => {
      if (!isAuthenticated || !userInfo) {
        console.log("📥 Cargando usuario en ProtectedRoute...");
        await loadUser(dispatch);
      } else {
        console.log("✅ Usuario ya autenticado:", userInfo.name);
      }
      setLoading(false);
    })();
  }, [dispatch, isAuthenticated, userInfo]);

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

  const isUserAuthenticated = isAuthenticated && userInfo && (userInfo._id || userInfo.id);
  
  console.log("🔒 ProtectedRoute - ¿Usuario autenticado?", isUserAuthenticated);
  console.log("🔒 ProtectedRoute - Detalles de validación:");
  console.log("  - isAuthenticated:", isAuthenticated);
  console.log("  - userInfo existe:", !!userInfo);
  console.log("  - userInfo._id:", userInfo?._id);
  console.log("  - userInfo.id:", userInfo?.id);

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

