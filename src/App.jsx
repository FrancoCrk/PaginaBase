import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";

function App() {
  useEffect(() => {
    // Intentamos obtener los datos del usuario desde localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));
    
    // Si no hay datos, no aplicar restricciones
    if (!userData) {
      console.log("⚠️ No hay userData en localStorage");
      return;
    }
    
    // Extraemos cargo y turno (normalizados a mayúsculas)
    const cargo = userData?.cargo?.toUpperCase() || "";
    const turno = userData?.turno?.toUpperCase() || "";
    
    console.log("👤 Usuario detectado:", { cargo, turno });
    
    // USUARIOS PRIVILEGIADOS: ADMIN o turno MOVIL
    // Estos usuarios NO tendrán NINGUNA restricción
    const isPrivileged = cargo === "ADMIN" || turno === "MOVIL";
    
    if (isPrivileged) {
      console.log("✅ Usuario privilegiado detectado. SIN RESTRICCIONES.");
      console.log("✅ Copiar/Pegar/Cortar: HABILITADO");
      console.log("✅ Selección de texto: HABILITADO");
      console.log("✅ Clic derecho: HABILITADO");
      console.log("✅ Todos los atajos: HABILITADOS");
      return; // Salir sin aplicar ningún bloqueo
    }
    
    console.log("🔒 Aplicando restricciones para usuario no privilegiado");
    
    // --- BLOQUEOS SOLO PARA USUARIOS NO PRIVILEGIADOS ---
    
    const handleKeyDown = (e) => {
      // Bloquear zoom con teclado (Ctrl/Cmd + +/-/0)
      if ((e.ctrlKey || e.metaKey) && (["+", "-", "0", "="].includes(e.key))) {
        e.preventDefault();
        return;
      }
      
      // Bloquear PrintScreen y variantes
      if (
        e.key === "PrintScreen" ||
        e.key === "Snapshot" ||
        (e.altKey && e.key === "PrintScreen")
      ) {
        e.preventDefault();
        return;
      }
      
      // Bloquear F11 (pantalla completa)
      if (e.key === "F11") {
        e.preventDefault();
        return;
      }
      
      // Bloquear herramientas de desarrollador
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      ) {
        e.preventDefault();
        return;
      }
    };
    
    // Bloquear zoom con rueda del mouse
    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    
    // Bloquear zoom con gestos táctiles (móviles/tablets)
    const handleTouchMove = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };
    
    // Bloquear menú contextual (clic derecho)
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    
    // Bloquear selección de texto (pero permitir en campos de formulario)
    const handleSelectStart = (e) => {
      // Permitir selección en elementos de formulario
      const allowedTags = ['INPUT', 'TEXTAREA', 'SELECT'];
      if (!allowedTags.includes(e.target.tagName)) {
        e.preventDefault();
      }
    };
    
    // --- Registrar todos los listeners ---
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);
    
    console.log("🔒 Restricciones aplicadas exitosamente");
    
    // --- Cleanup: remover listeners al desmontar ---
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
      console.log("🧹 Listeners removidos");
    };
  }, []); // Array vacío: solo se ejecuta una vez al montar

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
