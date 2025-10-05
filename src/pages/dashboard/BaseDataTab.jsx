import React, { useState, useEffect } from "react";
import ExcelJS from 'exceljs';
import { 
  addDataToBase, 
  updateSingleRecord, 
  deleteSingleRecord,
  updateTipificacion
} from "../../utils/databaseService";
import "../../styles/dashboard.css";
import backIcon from "../../assets/back.png";
import editIcon from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";
import addIcon from "../../assets/agregar.png";
import downloadIcon from "../../assets/data.png";
import ModalMiBaseDataAdd from "../ModalsBase/ModalMiBaseDataAdd";
import ModalMiBaseDataEdit from "../ModalsBase/ModalMiBaseDataEdit";
import ModalMIBaseDataDelete from "../ModalsBase/ModalMIBaseDataDelete";
import DeleteMiBaseData from "../ModalsBase/DeleteMiBaseData";

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

const BaseDataTab = ({ baseData, onBack, onDeleteBase, baseId, baseName, onDataUpdate, userRole, userCargo }) => {
  const [data, setData] = useState(baseData || []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteBaseModalOpen, setIsDeleteBaseModalOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(baseData || []);
  }, [baseData]);

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAdd = async (newRowData) => {
    setLoading(true);
    try {
      const result = await addDataToBase(baseId, newRowData);
      if (result.success) {
        const newData = [...data, result.data];
        setData(newData);
        onDataUpdate(newData, baseId);
        setIsAddModalOpen(false);
      } else {
        alert('Error al agregar el registro: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item) => {
    setCurrentData(item);
    setIsEditModalOpen(true);
  };

  const handleTipificacionChange = async (e, itemId) => {
    const newTipificacion = e.target.value;
    
    try {
      const result = await updateTipificacion(itemId, newTipificacion);
      if (result.success) {
        const newData = data.map(item =>
          item.id === itemId
            ? { ...item, tipificacion: newTipificacion }
            : item
        );
        setData(newData);
        onDataUpdate(newData, baseId);
      } else {
        alert('Error al actualizar la tipificación: ' + result.error);
        // Revertir el cambio en la UI
        e.target.value = data.find(item => item.id === itemId)?.tipificacion || '';
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
      // Revertir el cambio en la UI
      e.target.value = data.find(item => item.id === itemId)?.tipificacion || '';
    }
  };

  const handleSaveEdit = async (updatedData) => {
    setLoading(true);
    try {
      const result = await updateSingleRecord(updatedData.id, updatedData);
      if (result.success) {
        const newData = data.map(item =>
          item.id === updatedData.id ? result.data : item
        );
        setData(newData);
        setIsEditModalOpen(false);
        setCurrentData(null);
        onDataUpdate(newData, baseId);
      } else {
        alert('Error al actualizar el registro: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (item) => {
    setCurrentData(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentData) return;
    
    setLoading(true);
    try {
      const result = await deleteSingleRecord(currentData.id);
      if (result.success) {
        const newData = data.filter(item => item.id !== currentData.id);
        setData(newData);
        setIsDeleteModalOpen(false);
        setCurrentData(null);
        onDataUpdate(newData, baseId);
      } else {
        alert('Error al eliminar el registro: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBaseClick = () => {
    setIsDeleteBaseModalOpen(true);
  };

  const handleExportToExcel = async () => {
    try {
      const colorMap = {
        "NO DESEA": "F44336",        // Rojo fuerte
        "VENTA": "4CAF50",           // Verde fuerte
        "ATENDIDA": "8BC34A",        // Verde lima
        "NO CONTESTA": "9C27B0",     // Púrpura fuerte
        "AGENDADO": "FFEB3B",        // Amarillo fuerte
        "DE VIAJE": "FF9800",        // Naranja fuerte
        "MUDANZA": "FF9800",         // Naranja fuerte
        "POSIBLE FRAUDE": "F44336",  // Rojo fuerte
        "FACTIBILIDAD": "F44336",    // Rojo fuerte
        "FACILIDADES TECNICAS": "F44336" // Rojo fuerte
      };

      // Crear un nuevo libro de trabajo
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Base Exportada');

      // Definir las columnas
      worksheet.columns = [
        { header: 'DNI', key: 'dni', width: 12 },
        { header: 'NOMBRES COMPLETOS', key: 'nombreCompleto', width: 30 },
        { header: 'NUMERO 1', key: 'numero1', width: 15 },
        { header: 'NUMERO 2', key: 'numero2', width: 15 },
        { header: 'TIPIFICACION', key: 'tipificacion', width: 20 }
      ];

      // Estilo para el header
      worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF366092' }
        };
        cell.font = {
          bold: true,
          color: { argb: 'FFFFFFFF' }
        };
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle'
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Agregar los datos
      data.forEach((item, index) => {
        const row = worksheet.addRow({
          dni: item.dni || '',
          nombreCompleto: item.nombreCompleto || '',
          numero1: item.numero1 || '',
          numero2: item.numero2 || '',
          tipificacion: item.tipificacion || ''
        });

        // Aplicar color según la tipificación
        const bgColor = colorMap[item.tipificacion];
        if (bgColor) {
          row.eachCell((cell) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: `FF${bgColor}` }
            };
            // Agregar texto blanco para mejor contraste en colores oscuros
            cell.font = {
              color: { argb: 'FFFFFFFF' },
              bold: false
            };
            cell.border = {
              top: { style: 'thin', color: { argb: 'FF000000' } },
              left: { style: 'thin', color: { argb: 'FF000000' } },
              bottom: { style: 'thin', color: { argb: 'FF000000' } },
              right: { style: 'thin', color: { argb: 'FF000000' } }
            };
            cell.alignment = {
              horizontal: 'left',
              vertical: 'middle'
            };
          });
        }
      });

      // Exportar el archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Crear enlace de descarga
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${baseName || "Datos_Base"}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Limpiar
      URL.revokeObjectURL(link.href);
      
      console.log('Excel exportado exitosamente con colores');
      
    } catch (error) {
      console.error('Error al exportar Excel:', error);
      alert('Error al exportar el archivo Excel');
    }
  };

  // Función para determinar la clase de la fila según la tipificación
  const getRowClassName = (tipificacion) => {
    switch (tipificacion) {
      case 'VENTA':
        return 'row-venta';
      case 'ATENDIDA':
        return 'row-atendida';
      case 'NO CONTESTA':
        return 'row-no-contesta';
      case 'AGENDADO':
        return 'row-agendado';
      case 'DE VIAJE':
      case 'MUDANZA':
        return 'row-viaje-mudanza';
      case 'POSIBLE FRAUDE':
      case 'FACTIBILIDAD':
      case 'NO DESEA':
      case 'FACILIDADES TECNICAS':
        return 'row-rojo';
      default:
        return '';
    }
  };

  // Define los roles que tienen permisos de edición
  //const adminRoles = ['administrador', 'back office', 'supervisor'];
  const adminRoles = ['ADMIN', 'BACK OFFICE', 'SUPERVISOR'];

  // Verifica si el rol del usuario actual está en la lista de roles permitidos
  //const canEdit = adminRoles.includes(userRole);
  //const canEdit = adminRoles.includes(userRole.toUpperCase());
  const canEdit = userCargo?.toUpperCase() === 'ADMIN';

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
        <>
          {canEdit && (
            <button className="delete-base-btn" onClick={handleDeleteBaseClick}>
              <img src={deleteIcon} alt="Eliminar Base" className="deletebase-icon" />
            </button>
          )}
          {canEdit && (
            <button className="export-btn" onClick={handleExportToExcel}>
              <img src={downloadIcon} alt="Exportar" className="export-icon" />
              Exportar en Excel
            </button>
          )}
          {canEdit && (
            <button className="add-btn" onClick={handleAddClick}>
              <img src={addIcon} alt="Agregar" className="add-icon" />
            </button>
          )}
        </>
      </div>

      <div className="table-responsive">
        <table className="base-data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>DNI</th>
              <th>NOMBRES COMPLETOS</th>
              <th>NUMERO 1</th>
              <th>NUMERO 2</th>
              <th>TIPIFICACION</th>
              {canEdit && (
                <th>ACCIONES</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id} className={getRowClassName(item.tipificacion)}>
                  <td>{index + 1}</td>
                  <td>{item.dni || ''}</td>
                  <td>{item.nombreCompleto || ''}</td>
                  <td>{item.numero1 || ''}</td>
                  <td>{item.numero2 || ''}</td>
                  <td>
                    <select
                      className="tipificacion-select"
                      value={item.tipificacion || ''}
                      onChange={(e) => handleTipificacionChange(e, item.id)}
                    >
                      <option value="">-- Seleccione --</option>
                      {TIPIFICACIONES.map(opcion => (
                        <option key={opcion} value={opcion}>{opcion}</option>
                      ))}
                    </select>
                  </td>
                  {canEdit && (
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn" onClick={() => handleEditClick(item)}>
                          <img src={editIcon} alt="Editar" className="action-icon" />
                        </button>
                        <button className="action-btn" onClick={() => handleDeleteClick(item)}>
                          <img src={deleteIcon} alt="Eliminar" className="action-icon" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={canEdit ? "7" : "6"} style={{ textAlign: 'center', padding: '2rem' }}>
                  Base vacía. No hay datos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar datos */}
      <ModalMiBaseDataAdd
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAdd}
      />

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

      <DeleteMiBaseData
        isOpen={isDeleteBaseModalOpen}
        onClose={() => setIsDeleteBaseModalOpen(false)}
        onConfirm={onDeleteBase}
        baseName={baseName}
      />

    </div>
  );
};

export default BaseDataTab;
