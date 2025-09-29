import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx";
import '../../styles/dashboard.css';
import editIcon from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";
import downloadIcon from "../../assets/data.png";
import ModalMiBaseDataEdit from "../ModalsBase/ModalMiBaseDataEdit";
import ModalMIBaseDataDelete from "../ModalsBase/ModalMIBaseDataDelete";

// Lista de tipificaciones
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

const ReviewResultsTable = ({ onBack, baseName, reviewData, completeData }) => {
  const [data, setData] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);

  useEffect(() => {
    setData(completeData);
  }, [completeData]);

  const handleTipificacionChange = (e, itemId) => {
    const newData = data.map(item =>
      item.id === itemId
        ? { ...item, tipificacion: e.target.value }
        : item
    );
    setData(newData);
  };
  
  const handleEditClick = (item) => {
    setCurrentData(item);
    setIsEditModalOpen(true);
  };
  
  const handleSaveEdit = (updatedData) => {
    const newData = data.map(item =>
      item.id === updatedData.id ? updatedData : item
    );
    setData(newData);
    setIsEditModalOpen(false);
    setCurrentData(null);
  };

  const handleDeleteClick = (item) => {
    setCurrentData(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    const newData = data.filter(item => item.id !== currentData.id);
    setData(newData);
    setIsDeleteModalOpen(false);
    setCurrentData(null);
  };

  const handleExportToExcel = () => {
    const formattedData = data.map(item => ({
      DNI: item.dni,
      "NOMBRES COMPLETOS": item.nombreCompleto,
      "NUMERO 1": item.numero1.value,
      "NUMERO 2": item.numero2.value,
      TIPIFICACION: item.tipificacion,
    }));
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Resultados de Revisión");
    XLSX.writeFile(workbook, `Revision_${baseName || "Base"}_${new Date().toLocaleDateString()}.xlsx`);
  };

  const handleDeleteTable = () => {
    setData([]);
  };

  const getRowClassName = (row) => {
    if (row.numero1.type === 'blackList' || row.numero2.type === 'blackList') {
        return 'row-blocked';
    }
    if (row.numero1.type === 'sospechoso' || row.numero2.type === 'sospechoso') {
        return 'row-suspicious';
    }
    return '';
  };

  return (
    <>
      <div className="table-header-actions">
        <button className="delete-base-btn2" onClick={handleDeleteTable}>
          <img src={deleteIcon} alt="Borrar Tabla" className="deletebase-icon2" />
        </button>
        <button className="export-btn2" onClick={handleExportToExcel}>
          <img src={downloadIcon} alt="Exportar" className="export-icon" />
          Exportar en Excel
        </button>
      </div>
      
      <div className="tab-container">
        <div className="table-responsive-conteiner">
          <table className="base-data-table2">
            <thead>
              <tr>
                <th>ID</th>
                <th>DNI</th>
                <th>Nombre Completo</th>
                <th>Número 1</th>
                <th>Número 2</th>
                <th>TIPIFICACION</th>
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.id} className={getRowClassName(row)}>
                    <td>{row.id}</td>
                    <td>{row.dni}</td>
                    <td>{row.nombreCompleto}</td>
                    <td>
                      <span className={row.numero1.type === 'blackList' ? 'number-blocked' : (row.numero1.type === 'sospechoso' ? 'number-suspicious' : '')}>
                        {row.numero1.value}
                      </span>
                    </td>
                    <td>
                      <span className={row.numero2.type === 'blackList' ? 'number-blocked' : (row.numero2.type === 'sospechoso' ? 'number-suspicious' : '')}>
                        {row.numero2.value}
                      </span>
                    </td>
                    <td>
                      <select
                        className="tipificacion-select"
                        value={row.tipificacion || ''}
                        onChange={(e) => handleTipificacionChange(e, row.id)}
                      >
                        <option value="">-- Seleccione --</option>
                        {TIPIFICACIONES.map(opcion => (
                          <option key={opcion} value={opcion}>{opcion}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" onClick={() => handleEditClick(row)}>
                          <img src={editIcon} alt="Editar" className="action-icon" />
                        </button>
                        <button className="action-btn" onClick={() => handleDeleteClick(row)}>
                          <img src={deleteIcon} alt="Eliminar" className="action-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                    No hay datos de revisión para mostrar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {currentData && (
        <ModalMiBaseDataEdit
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEdit}
          rowData={currentData}
        />
      )}
      {currentData && (
        <ModalMIBaseDataDelete
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemDni={currentData.dni}
        />
      )}
    </>
  );
};

export default ReviewResultsTable;