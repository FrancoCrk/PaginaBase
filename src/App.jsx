import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";

function App() {
  useEffect(() => {
    // Obtener el rol actual del usuario (puedes cambiar esta línea según tu app)
    const userRole = localStorage.getItem("userRole"); 
    // Ejemplo de valores esperados: "ADMIN", "ASESOR_MOVIL", "ASESOR_TARDE", "ASESOR_MAÑANA", etc.

    // SOLO aplicar bloqueos si NO es ADMIN ni ASESOR_MOVIL
    if (userRole !== "ADMIN" && userRole !== "MOVIL") {

      // Bloquear zoom y capturas de pantalla de navegador
      const handleKeyDown = (e) => {
        // Bloquear zoom (Ctrl + +/- y 0)
        if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '-' || e.key === '0')) {
          e.preventDefault();
        }
        // Bloquear PrintScreen y F11
        if (e.key === 'PrintScreen' || e.key === 'Snapshot' || (e.altKey && e.key === 'PrintScreen') || e.key === 'F11') {
          e.preventDefault();
        }
      };

      const handleWheel = (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
        }
      };

      // Bloquear gestos táctiles
      const handleTouchMove = (e) => {
        if (e.scale !== 1) e.preventDefault();
      };

      // Bloquear clic derecho y selección de texto
      const handleContextMenu = (e) => e.preventDefault();
      const handleSelectStart = (e) => e.preventDefault();

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("wheel", handleWheel, { passive: false });
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("contextmenu", handleContextMenu);
      document.addEventListener("selectstart", handleSelectStart);

      // Limpieza al desmontar
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("wheel", handleWheel);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("contextmenu", handleContextMenu);
        document.removeEventListener("selectstart", handleSelectStart);
      };
    }
  }, []);

  return (
    <Router>
      <meta 
        name="viewport" 
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" 
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
