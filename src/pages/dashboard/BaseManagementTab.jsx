import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
import miBaseIcon from "../../assets/mibase.png"; // Necesitarás crear estos iconos
import baseAsesorIcon from "../../assets/asesor.png";
import revisionBaseIcon from "../../assets/revisionbase.png";

const BaseManagementTab = ({ onMiBaseClick, onBaseAsesorClick, onRevisionBaseClick }) => {
  return (
    <div className="tab-container">
      <div className="home-buttons">
        {/* Botón 1: Mi Base */}
        <button className="home-btn" onClick={onMiBaseClick}>
          <img src={miBaseIcon} alt="Mi Base" className="btn-icon4" />
          <span>Mi Base</span>
        </button>

        {/* Botón 2: Base Asesor */}
        <button className="home-btn" onClick={onBaseAsesorClick}>
          <img src={baseAsesorIcon} alt="Base Asesor" className="btn-icon3" />
          <span>Base Asesor</span>
        </button>

        {/* Botón 3: Revisión de Base */}
        <button className="home-btn" onClick={onRevisionBaseClick}>
          <img src={revisionBaseIcon} alt="Revisión de Base" className="btn-icon3" />
          <span>Revisión de Base</span>
        </button>
      </div>
    </div>
  );
};

export default BaseManagementTab;   