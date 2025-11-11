import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";

function App() {
  useEffect(() => {
    // Intentamos obtener los datos del usuario desde localStorage
    const userData = JSON.parse(localStorage.getItem("userData"));

    // Si no hay datos, no aplicar nada
    if (!userData) return;

    // Extraemos cargo y turno
    const cargo = userData?.cargo?.toUpperCase() || "";
    const turno = userData?.turno?.toUpperCase() || "";

    // Solo aplicar bloqueos si NO es ADMIN ni turno MOVIL
    const isPrivileged = cargo === "ADMIN" || turno === "MOVIL";
    if (isPrivileged) return;

    // --- BLOQUEOS SOLO PARA USUARIOS NO PRIVILEGIADOS ---
    const handleKeyDown = (e) => {
      // Bloquear zoom (Ctrl + +/- y 0)
      if ((e.ctrlKey || e.metaKey) && (["+", "-", "0"].includes(e.key))) {
        e.preventDefault();
      }

      // Bloquear PrintScreen y F11
      if (
        e.key === "PrintScreen" ||
        e.key === "Snapshot" ||
        (e.altKey && e.key === "PrintScreen") ||
        e.key === "F11"
      ) {
        e.preventDefault();
      }

      // Opcional: bloquear herramientas de desarrollador (F12, Ctrl+Shift+I/J)
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key.toUpperCase())) ||
        (e.ctrlKey && e.key.toUpperCase() === "U")
      ) {
        e.preventDefault();
      }
    };

    const handleWheel = (e) => {
      if (e.ctrlKey) e.preventDefault();
    };

    const handleTouchMove = (e) => {
      if (e.scale !== 1) e.preventDefault();
    };

    const handleContextMenu = (e) => e.preventDefault(); // Bloquear clic derecho
    const handleSelectStart = (e) => e.preventDefault(); // Bloquear selección de texto

    // --- Registrar listeners ---
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("selectstart", handleSelectStart);

    // --- Limpiar al desmontar ---
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("selectstart", handleSelectStart);
    };
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
