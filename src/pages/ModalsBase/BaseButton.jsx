import React from "react";
import "../../styles/Modals2.css";
import excelIcon from "../../assets/excel.png"; // Necesitarás crear este icono

const BaseButton = ({ nombre, fecha, onClick }) => {
  return (
    <button className="base-button" onClick={onClick}>
      <div className="base-button-content">
        <div className="base-button-name">{nombre}</div>
        <img src={excelIcon} alt="Excel" className="base-button-icon" />
        <div className="base-button-info">          
          <div className="base-button-date">{fecha}</div>
        </div>
      </div>
    </button>
  );
};

export default BaseButton;