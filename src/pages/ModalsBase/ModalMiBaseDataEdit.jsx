import React, { useState, useEffect } from 'react';
import '../../styles/Modals.css';

const TIPIFICACIONES = [
  "NO DESEA",
  "ATENDIDA",
  "VENTA",
  "NO CONTESTA",
  "AGENDADO",
  "DE VIAJE",
  "MUDANZA",
  "POSIBLE FRAUDE",
  "FACTIBILIDAD",
  "FACILIDADES TECNICAS"
];

const ModalMiBaseDataEdit = ({ isOpen, onClose, onSave, rowData }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen && rowData) {
      setFormData(rowData);
    }
  }, [isOpen, rowData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-header">Editar Datos de la Base</h2>
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="dni">DNI</label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="nombreCompleto">Nombres Completos</label>
              <input
                type="text"
                id="nombreCompleto"
                name="nombreCompleto"
                value={formData.nombreCompleto || ''}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="numero1">Número 1</label>
              <input
                type="text"
                id="numero1"
                name="numero1"
                value={formData.numero1 || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="numero2">Número 2</label>
              <input
                type="text"
                id="numero2"
                name="numero2"
                value={formData.numero2 || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tipificacion">Tipificación</label>
              <select
                id="tipificacion"
                name="tipificacion"
                value={formData.tipificacion || ''}
                onChange={handleChange}
              >
                <option value="">-- Seleccione una opción --</option>
                {TIPIFICACIONES.map(opcion => (
                  <option key={opcion} value={opcion}>{opcion}</option>
                ))}
              </select>
            </div>
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn cancel">
                CANCELAR
              </button>
              <button type="submit" className="btn save">
                GUARDAR CAMBIOS
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalMiBaseDataEdit;