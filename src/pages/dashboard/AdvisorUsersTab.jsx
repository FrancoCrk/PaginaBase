import React, { useState, useEffect } from "react";
import { 
  getAsesores, 
  createAsesor, 
  updateAsesor, 
  deleteAsesor, 
  toggleAsesorActive,
  getNextAsesorId 
} from "../../utils/databaseService";
import "../../styles/dashboard.css";
import "../../styles/Modals.css";
import backIcon from "../../assets/back.png";
import editIcon from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";
import addIcon from "../../assets/agregar.png";
import toggleOnIcon from "../../assets/on.png";
import toggleOffIcon from "../../assets/off.png";
import showPasswordIcon from "../../assets/show-password.png";
import hidePasswordIcon from "../../assets/hide-password.png";
import ModalAdvisorAdd from "../Modals/ModalAdvisorAdd";
import ModalAdvisorEdit from '../Modals/ModalAdvisorEdit';
import ModalConfirmDelete from '../Modals/ModalConfirmDelete';

const AdvisorUsersTab = ({ onBack, onDataUpdate }) => {
  const [advisors, setAdvisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAdvisor, setCurrentAdvisor] = useState(null);

  // Cargar asesores al montar el componente
  useEffect(() => {
    loadAsesores();
  }, []);

  const loadAsesores = async () => {
    setLoading(true);
    try {
      const result = await getAsesores();
      if (result.success) {
        // Convertir formato de Supabase al formato esperado por el componente
        const formattedAsesores = result.data.map(asesor => ({
          id: asesor.id,
          dni: asesor.dni,
          nombre: asesor.nombre,
          turno: asesor.turno,
          contraseña: asesor.password,
          tipo: 'asesor',
          isActive: asesor.is_active,
          showPassword: asesor.show_password || false
        }));
        setAdvisors(formattedAsesores);
        
        // Notificar al Dashboard para actualizar su estado de advisorUsers
        if (onDataUpdate) {
          onDataUpdate();
        }
      } else {
        console.error('Error cargando asesores:', result.error);
        alert('Error al cargar los asesores');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    const advisor = advisors.find(a => a.id === id);
    if (!advisor) return;

    try {
      const result = await toggleAsesorActive(id, !advisor.isActive);
      if (result.success) {
        setAdvisors(prev => prev.map(a =>
          a.id === id ? { ...a, isActive: !a.isActive } : a
        ));
        
        // Actualizar Dashboard
        if (onDataUpdate) {
          onDataUpdate();
        }
      } else {
        alert('Error al actualizar el estado del asesor');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleTogglePassword = (id) => {
    setAdvisors(prev => prev.map(advisor =>
      advisor.id === id ? { ...advisor, showPassword: !advisor.showPassword } : advisor
    ));
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveAdvisor = async (newAdvisor) => {
    try {
      const nextId = await getNextAsesorId();
      const asesorData = {
        id: nextId,
        dni: newAdvisor.dni,
        nombre: newAdvisor.nombre,
        turno: newAdvisor.turno,
        contraseña: newAdvisor.password
      };

      const result = await createAsesor(asesorData);
      
      if (result.success) {
        // Recargar la lista
        await loadAsesores();
        setIsAddModalOpen(false);
      } else {
        alert('Error al crear asesor: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleEdit = (advisor) => {
    setCurrentAdvisor(advisor);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedAdvisor) => {
    if (!currentAdvisor) return;

    try {
      const result = await updateAsesor(currentAdvisor.id, updatedAdvisor);
      
      if (result.success) {
        // Recargar la lista
        await loadAsesores();
        setIsEditModalOpen(false);
        setCurrentAdvisor(null);
      } else {
        alert('Error al actualizar asesor: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleDeleteClick = (advisor) => {
    setCurrentAdvisor(advisor);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentAdvisor) return;

    try {
      const result = await deleteAsesor(currentAdvisor.id);
      
      if (result.success) {
        // Recargar la lista
        await loadAsesores();
        setIsDeleteModalOpen(false);
        setCurrentAdvisor(null);
      } else {
        alert('Error al eliminar asesor: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  if (loading) {
    return (
      <div className="admin-tab">
        <div className="table-header-actions">
          <button className="back-btn" onClick={onBack}>
            <img src={backIcon} alt="Volver" className="back-icon" />
            Volver
          </button>
        </div>
        <div className="revising-content-modal2">
          <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-tab">
      <div className="table-header-actions">
        <button className="back-btn" onClick={onBack}>
          <img src={backIcon} alt="Volver" className="back-icon" />
          Volver
        </button>
        
        <button className="add-btn" onClick={handleAdd}>
          <img src={addIcon} alt="Agregar" className="add-icon" />
        </button>
      </div>
      
      <div className="table-responsive">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DNI</th>
              <th>Nombre</th>
              <th>Turno</th>
              <th>Contraseña</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {advisors.map((advisor, index) => (
              <tr key={advisor.id}>
                <td>{index + 1}</td>
                <td>{advisor.dni}</td>
                <td>{advisor.nombre}</td>
                <td>{advisor.turno}</td>
                <td className="password-cell">
                  <div className="password-container">
                    <span className="password-text">
                      {advisor.showPassword ? advisor.contraseña : '*'.repeat(advisor.contraseña.length)}
                    </span>
                    <button 
                      className="password-toggle" 
                      onClick={() => handleTogglePassword(advisor.id)}
                    >
                      <img 
                        src={advisor.showPassword ? hidePasswordIcon : showPasswordIcon} 
                        alt={advisor.showPassword ? "Ocultar" : "Mostrar"} 
                        className="password-icon"
                      />
                    </button>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="action-btn" 
                      onClick={() => handleToggle(advisor.id)}
                    >
                      <img 
                        src={advisor.isActive ? toggleOnIcon : toggleOffIcon} 
                        alt={advisor.isActive ? "Activo" : "Inactivo"} 
                        className="action-icon toggle-icon"
                      />
                    </button>
                    <button 
                      className="action-btn" 
                      onClick={() => handleEdit(advisor)}
                    >
                      <img src={editIcon} alt="Editar" className="action-icon" />
                    </button>
                    <button 
                      className="action-btn"
                      onClick={() => handleDeleteClick(advisor)}
                    >
                      <img src={deleteIcon} alt="Eliminar" className="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalAdvisorAdd
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAdvisor}
      />

      <ModalAdvisorEdit
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        advisorData={currentAdvisor}
      />

      <ModalConfirmDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={currentAdvisor ? `${currentAdvisor.nombre} (${currentAdvisor.dni})` : ''}
      />
    </div>
  );
};

export default AdvisorUsersTab;