import React from 'react';
import '../../styles/Modals.css';
import successIcon from "../../assets/success.png";
import warningIcon from "../../assets/warning.png";

const ModalStatus = ({ isOpen, onClose, viewState, foundMatches, foundSuspicious, onReviewTable }) => {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (viewState) {
      case "revisando":
        return (
          <div className="revising-content-modal">
            <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            <p>Revisando...</p>
          </div>
        );
      case "sin_coincidencias":
        return (
          <div className="review-result-content-modal">
            <img src={successIcon} alt="Éxito" className="result-icon" />
            <p>0 coincidencias, puedes subir la base sin problema.</p>
          </div>
        );
      case "con_coincidencias":
        return (
          <div className="review-result-content-modal">
            <img src={warningIcon} alt="Advertencia" className="result-icon" />
            {/* NUEVO: Muestra ambos recuentos */}
            <p>
              Se encontraron {foundMatches.length} coincidencias y {foundSuspicious.length} sospechosos.
            </p>
            <button className="review-table-btn" onClick={onReviewTable}>
              Revisar tabla
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="review-modal-overlay">
      <div className="review-modal-container2">
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        {renderContent()}
      </div>
    </div>
  );
};

export default ModalStatus;