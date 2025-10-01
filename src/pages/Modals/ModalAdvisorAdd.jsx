// src/pages/Modals/ModalAdvisorAdd.jsx
import React from 'react';
import './../../styles/Modals.css';

const ModalAdvisorAdd = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = React.useState({
    dni: '',
    nombre: '',
    turno: 'MAÑANA',
    password: ''
  });

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
        <h2 className="modal-header">Agregar Usuario Asesor</h2>

        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="dni">DNI</label>
              <input
                type="text"
                id="dni"
                name="dni"
                value={formData.dni}
                onChange={handleChange}
                placeholder="Escribe el DNI"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Escribe un nombre"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="turno">Turno</label>
              <select
                id="turno"
                name="turno"
                value={formData.turno}
                onChange={handleChange}
                required
              >
                <option value="MAÑANA">MAÑANA</option>
                <option value="TARDE">TARDE</option>
                <option value="MOVIL">MOVIL</option>
                
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn cancel">
                CANCELAR
              </button>
              <button type="submit" className="btn save">
                GUARDAR
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalAdvisorAdd;
