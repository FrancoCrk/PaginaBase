import React, { useEffect } from 'react';
import './../../styles/Modals.css';

const ModalAdvisorEdit = ({ isOpen, onClose, onSave, advisorData }) => {
  const [formData, setFormData] = React.useState({
    dni: '',
    nombre: '',
    turno: 'MAÑANA',
    password: ''
  });

  // Carga los datos del asesor cuando el modal se abre
  useEffect(() => {
    if (isOpen && advisorData) {
      setFormData({
        dni: advisorData.dni || '',
        nombre: advisorData.nombre || '',
        turno: advisorData.turno || 'MAÑANA',
        password: '' // Contraseña no se precarga por seguridad
      });
    }
  }, [isOpen, advisorData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Solo actualiza contraseña si se proporcionó una nueva
    const dataToSave = formData.password 
      ? formData 
      : { ...formData, password: undefined };
    onSave(dataToSave);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-header">Editar Asesor</h2>

        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>DNI del Asesor</label>
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
                placeholder="Ej: CARLOS MARTINEZ"
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
              <label htmlFor="password">Nueva Contraseña (opcional)</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Dejar en blanco para mantener la actual"
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

export default ModalAdvisorEdit;
