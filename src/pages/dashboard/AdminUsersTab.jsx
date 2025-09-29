import React, { useState, useEffect } from "react";
import { 
  getAdministradores, 
  createAdministrador, 
  updateAdministrador, 
  deleteAdministrador, 
  toggleAdministradorActive,
  getNextAdminId 
} from "../../utils/databaseService";
import "../../styles/dashboard.css";
import '../../styles/Modals.css';
import backIcon from "../../assets/back.png";
import editIcon from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";
import addIcon from "../../assets/agregar.png";
import toggleOnIcon from "../../assets/on.png";
import toggleOffIcon from "../../assets/off.png";
import showPasswordIcon from "../../assets/show-password.png";
import hidePasswordIcon from "../../assets/hide-password.png";
import ModalAdminAdd from "../Modals/ModalAdminAdd";
import ModalAdminEdit from '../Modals/ModalAdminEdit';
import ModalConfirmDelete from '../Modals/ModalConfirmDelete';
import "../../styles/Modals.css";

const AdminUsersTab = ({ onBack }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  // Cargar administradores al montar el componente
  useEffect(() => {
    loadAdministradores();
  }, []);

  const loadAdministradores = async () => {
    setLoading(true);
    try {
      const result = await getAdministradores();
      if (result.success) {
        // Convertir formato de Supabase al formato esperado por el componente
        const formattedAdmins = result.data.map(admin => ({
          id: admin.id,
          dni: admin.dni,
          nombre: admin.nombre,
          cargo: admin.cargo,
          contraseña: admin.password,
          tipo: 'administrador',
          isActive: admin.is_active,
          showPassword: admin.show_password || false
        }));
        setAdmins(formattedAdmins);
      } else {
        console.error('Error cargando administradores:', result.error);
        alert('Error al cargar los administradores');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id) => {
    const admin = admins.find(a => a.id === id);
    if (!admin) return;

    try {
      const result = await toggleAdministradorActive(id, !admin.isActive);
      if (result.success) {
        setAdmins(prev => prev.map(a =>
          a.id === id ? { ...a, isActive: !a.isActive } : a
        ));
      } else {
        alert('Error al actualizar el estado del administrador');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleTogglePassword = (id) => {
    setAdmins(prev => prev.map(admin =>
      admin.id === id ? { ...admin, showPassword: !admin.showPassword } : admin
    ));
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveAdmin = async (newAdmin) => {
    try {
      const nextId = await getNextAdminId();
      const adminData = {
        id: nextId,
        dni: newAdmin.ci,
        nombre: newAdmin.nombre,
        cargo: newAdmin.cargo,
        contraseña: newAdmin.password
      };

      const result = await createAdministrador(adminData);
      
      if (result.success) {
        // Recargar la lista
        await loadAdministradores();
        setIsAddModalOpen(false);
      } else {
        alert('Error al crear administrador: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleEdit = (admin) => {
    setCurrentAdmin(admin);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedAdmin) => {
    if (!currentAdmin) return;

    try {
      const result = await updateAdministrador(currentAdmin.id, updatedAdmin);
      
      if (result.success) {
        // Recargar la lista
        await loadAdministradores();
        setIsEditModalOpen(false);
        setCurrentAdmin(null);
      } else {
        alert('Error al actualizar administrador: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    }
  };

  const handleDeleteClick = (admin) => {
    setCurrentAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentAdmin) return;

    try {
      const result = await deleteAdministrador(currentAdmin.id);
      
      if (result.success) {
        // Recargar la lista
        await loadAdministradores();
        setIsDeleteModalOpen(false);
        setCurrentAdmin(null);
      } else {
        alert('Error al eliminar administrador: ' + result.error);
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
              <th>Cargo</th>
              <th>Contraseña</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, index) => (
              <tr key={admin.id}>
                <td>{index + 1}</td>
                <td>{admin.dni}</td>
                <td>{admin.nombre}</td>
                <td>{admin.cargo}</td>
                <td className="password-cell">
                  <div className="password-container">
                    <span className="password-text">
                      {admin.showPassword ? admin.contraseña : '*'.repeat(admin.contraseña.length)}
                    </span>
                    <button
                      className="password-toggle"
                      onClick={() => handleTogglePassword(admin.id)}
                    >
                      <img
                        src={admin.showPassword ? hidePasswordIcon : showPasswordIcon}
                        alt={admin.showPassword ? "Ocultar" : "Mostrar"}
                        className="password-icon"
                      />
                    </button>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn"
                      onClick={() => handleToggle(admin.id)}
                    >
                      <img
                        src={admin.isActive ? toggleOnIcon : toggleOffIcon}
                        alt={admin.isActive ? "Activo" : "Inactivo"}
                        className="action-icon toggle-icon"
                      />
                    </button>
                    <button className="action-btn" onClick={() => handleEdit(admin)}>
                      <img src={editIcon} alt="Editar" className="action-icon" />
                    </button>
                    <button className="action-btn" onClick={() => handleDeleteClick(admin)}>
                      <img src={deleteIcon} alt="Eliminar" className="action-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ModalAdminAdd
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveAdmin}
      />
      <ModalAdminEdit
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        userData={currentAdmin}
      />
      <ModalConfirmDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={currentAdmin ? `${currentAdmin.nombre} (${currentAdmin.dni})` : ''}
      />
    </div>
  );
};

export default AdminUsersTab;