// En src/components/TabTitle.jsx
import React from "react";
import "../../../styles/dashboard.css"; // Asegúrate de importar los estilos

const TabTitle = ({ title }) => {
  return (
    <div className="tab-title-container">
      <div className="red-stripe"></div>
      <h1 className="tab-title">{title}</h1>
    </div>
  );
};

export default TabTitle;