// src/pages/Modals/ModalAdminAdd.jsx
import React from 'react';
import './../../styles/Modals.css';

const ModalAdminAdd = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = React.useState({
    ci: '',
    nombre: '',
    cargo: 'BACK OFFICE',
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
        <h2 className="modal-header">Agregar Usuario Admin</h2>

        <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="ci">Cédula de Identidad</label>
            <input
              type="text"
              id="ci"
              name="ci"
              value={formData.ci}
              onChange={handleChange}
              placeholder="Escribe el Dni"
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
            <label htmlFor="cargo">Cargo</label>
            <select
              id="cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              required
            >
              <option value="ADMIN">ADMIN</option>
              <option value="BACK OFFICE">BACK OFFICE</option>              
              <option value="ADMIN">SUPERVISOR</option>
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

export default ModalAdminAdd;