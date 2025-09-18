import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import setBearer from "../../../Utils/setBearer";

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Corregido: usar userInfo en lugar de currentUser
  const { userInfo, token } = useSelector((state) => state.user);

  useEffect(() => {
    console.log("🔍 Boards - userInfo:", userInfo);
    console.log("🔍 Boards - token:", token ? "Presente" : "Ausente");
    
    const fetchBoards = async () => {
      // Usar token del Redux state o localStorage como backup
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
    
    fetchBoards();
  }, [userInfo, token]);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Cargando tableros...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>Error</h1>
        <p style={{ color: 'red' }}>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '10px' }}>Mis Tableros</h1>
        {userInfo && (
          <p style={{ color: '#666', fontSize: '16px' }}>
            Bienvenido, {userInfo.name}! ({userInfo.email})
          </p>
        )}
      </header>
      
      {boards.length > 0 ? (
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px',
            marginBottom: '30px'
          }}>
            {boards.map((board) => (
              <div 
                key={board._id} 
                style={{ 
                  padding: '20px', 
                  border: '1px solid #ddd', 
                  borderRadius: '8px',
                  backgroundColor: '#f9f9f9',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                  {board.title || 'Tablero sin título'}
                </h3>
                {board.description && (
                  <p style={{ color: '#666', fontSize: '14px', margin: '0' }}>
                    {board.description}
                  </p>
                )}
                <div style={{ 
                  marginTop: '15px', 
                  fontSize: '12px', 
                  color: '#999' 
                }}>
                  Creado: {new Date(board.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          
          <button
            style={{
              padding: '15px 30px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#218838';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#28a745';
            }}
            onClick={() => {
              console.log("Crear nuevo tablero - funcionalidad por implementar");
              // Aquí irá la lógica para crear un nuevo tablero
            }}
          >
            + Crear Nuevo Tablero
          </button>
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          border: '2px dashed #dee2e6'
        }}>
          <h2 style={{ color: '#6c757d', marginBottom: '20px' }}>
            No tienes tableros aún
          </h2>
          <p style={{ color: '#6c757d', marginBottom: '30px', fontSize: '16px' }}>
            Crea tu primer tablero para empezar a organizar tus tareas
          </p>
          <button
            style={{
              padding: '15px 30px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#0056b3';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#007bff';
            }}
            onClick={() => {
              console.log("Crear primer tablero - funcionalidad por implementar");
              // Aquí irá la lógica para crear el primer tablero
            }}
          >
            Crear Mi Primer Tablero
          </button>
        </div>
      )}
      
      {/* Debug info - remover en producción */}
      <div style={{ 
        marginTop: '40px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '5px',
        fontSize: '12px',
        color: '#666'
      }}>
        <strong>Debug Info:</strong><br/>
        Usuario: {userInfo?.name || 'No cargado'}<br/>
        Token: {token ? 'Presente' : 'Ausente'}<br/>
        Tableros encontrados: {boards.length}<br/>
        Estado: {loading ? 'Cargando' : 'Cargado'}
      </div>
    </div>
  );
};

export default Boards;
