import React from "react";
import { useNavigate } from "react-router-dom";
import icono1 from "../../assets/usuarios.png";
import icono2 from "../../assets/base.png";
import icono3 from "../../assets/data.png";

const HomeTab = ({ setActiveTab, userRole }) => {  // Recibir userRole como prop
  return (
    <div className="home-tab">
      <div className="home-buttons">
        {/* Mostrar Gestión de Usuarios SOLO para administradores */}
        {userRole === "administrador" && (
          <button 
            onClick={() => setActiveTab("tab2")} 
            className="home-btn"
          >
            <img src={icono1} alt="Gestión de Usuarios" className="btn-icon2" />
            <span>Gestión de Usuarios</span>
          </button>
        )}

        {/* Gestión de Base - Visible para todos los admin */}
        <button 
          onClick={() => setActiveTab("tab3")} 
          className="home-btn"
        >
          <img src={icono2} alt="Gestión de Base" className="btn-icon2" />
          <span>Gestión de Base</span>
        </button>

        {/* Base - Visible para todos */}
        <button 
          onClick={() => setActiveTab("tab4")} 
          className="home-btn"
        >
          <img src={icono3} alt="Base" className="btn-icon2" />
          <span>Base</span>
        </button>
      </div>
    </div>
  );
};

export default HomeTab;