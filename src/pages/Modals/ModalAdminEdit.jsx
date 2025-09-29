import React, { useEffect } from 'react';
import './../../styles/Modals.css';

const ModalAdminEdit = ({ isOpen, onClose, onSave, userData }) => {
  const [formData, setFormData] = React.useState({
    dni: '',
    nombre: '',
    cargo: 'ADMINISTRADOR',
    password: ''
  });

  // Carga los datos cuando el modal se abre o userData cambia
  useEffect(() => {
    if (isOpen && userData) {
      setFormData({
        dni: userData.dni || '',
        nombre: userData.nombre || '',
        cargo: userData.cargo || 'ADMINISTRADOR',
        password: '' // No precargamos la contraseña por seguridad
      });
    }
  }, [isOpen, userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Solo actualizamos contraseña si se proporcionó una nueva
    const dataToSave = {
      dni: formData.dni,
      nombre: formData.nombre.toUpperCase(),
      cargo: formData.cargo.toUpperCase(),
      ...(formData.password && { contraseña: formData.password })
    };
    onSave(dataToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-header">Editar Administrador</h2>

        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>DNI del Administrador</label>
              <div className="dni-display">
                {formData.dni || 'No especificado'}
              </div>
              <small className="edit-notice">El DNI no puede ser modificado</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="nombre">Nombre Completo</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: MARIO GOMEZ"
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
                <option value="SUPERVISOR">SUPERVISOR</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Nueva Contraseña (opcional)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Dejar en blanco para no cambiar"
              />
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

export default ModalAdminEdit;