import React from 'react';
import '../../styles/Modals.css';

const ModalMIBaseDataDelete = ({ isOpen, onClose, onConfirm, itemDni }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-header">Confirmar Eliminación</h2>
        <div className="modal-content">
          <p>¿Estás seguro de que deseas eliminar el dato con DNI **{itemDni}**?</p>
          <p>Esta acción no se puede deshacer.</p>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn cancel">
              CANCELAR
            </button>
            <button type="button" onClick={onConfirm} className="btn delete-btn">
              ELIMINAR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalMIBaseDataDelete;