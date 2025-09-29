import React from "react";
import logo from "../../assets/logo2.png";
import inicioIcon from "../../assets/inicio.png";
import usuariosIcon from "../../assets/usuarios.png";
import baseIcon from "../../assets/base.png";
import dataIcon from "../../assets/data.png";
import logoutIcon from "../../assets/logout.png";

const Sidebar = ({ setActiveTab }) => {
  const handleLogout = () => {
    window.location.href = "/"; // Regresa al login
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <img src={logo} alt="Logo" />
      </div>

      {/* Botones principales */}
      <div className="sidebar-buttons">
        <button onClick={() => setActiveTab("tab1")}>
          <img src={inicioIcon} alt="" className="btn-icon" />
          Inicio
        </button>
        <button onClick={() => setActiveTab("tab2")}>
          <img src={usuariosIcon} alt="" className="btn-icon" />
          Gestión de Usuarios
        </button>
        <button onClick={() => setActiveTab("tab3")}>
          <img src={baseIcon} alt="" className="btn-icon" />
          Gestión de Base
        </button>
        <button onClick={() => setActiveTab("tab4")}>
          <img src={dataIcon} alt="" className="btn-icon" />
          Base
        </button>
      </div>

      {/* Botón cerrar sesión */}
      <div className="logout-section">
        <button className="logout-btn" onClick={handleLogout}>
          <img src={logoutIcon} alt="" className="btn-icon" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
