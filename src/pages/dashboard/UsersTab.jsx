import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/dashboard.css";
import adminIcon from "../../assets/admin.png";
import advisorIcon from "../../assets/asesor.png";

const UsersTab = ({ onAdminClick, onAdvisorClick }) => {
  return (
    <div className="tab-container">
      <div className="home-buttons">
        <button className="home-btn" onClick={onAdminClick}>
          <img src={adminIcon} alt="Admin" className="btn-icon3" />
          <span>Administradores</span>
        </button>
        <button className="home-btn" onClick={onAdvisorClick}>
          <img src={advisorIcon} alt="Asesor" className="btn-icon3" />
          <span>Asesores</span>
        </button>
      </div>
    </div>
  );
};

export default UsersTab;