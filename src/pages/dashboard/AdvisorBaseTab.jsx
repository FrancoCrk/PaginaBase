import React from 'react';
import '../../styles/dashboard.css';
import '../../styles/Modals.css';
import backIcon from "../../assets/back.png";

const AdvisorBaseTab = ({ advisorUsers, bases, onBack, onViewBaseClick, loading = false }) => {

  // Función para contar las bases de un asesor
  const countBasesForAdvisor = (advisorId) => {
    return bases.filter(base => base.advisorId === advisorId).length;
  };

  if (loading) {
    return (
      <>
        <div className="header-with-actions">
          <button className="back-btn2" onClick={onBack}>
            <img src={backIcon} alt="Volver" className="back-icon2" />
            Volver
          </button>
        </div>
        <div className="revising-content-modal2">
          <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="header-with-actions">
        <button className="back-btn2" onClick={onBack}>
          <img src={backIcon} alt="Volver" className="back-icon2" />
          Volver
        </button>
      </div>

      {advisorUsers.length > 0 ? (
        <div className="table-responsive">
          <table className="advisor-users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DNI</th>
                <th>Nombre Completo</th>
                <th>Turno</th>
                <th>Base</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {advisorUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.dni}</td>
                  <td>{user.nombre}</td>
                  <td>{user.turno || 'N/A'}</td>
                  <td>{countBasesForAdvisor(user.id)}</td>
                  <td>
                    <button 
                      className="table-action-btn"
                      onClick={() => onViewBaseClick(user)}
                    >
                      Ver Base
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-data-message">
          <p>No hay usuarios asesores registrados.</p>
        </div>
      )}
    </>
  );
};

export default AdvisorBaseTab;