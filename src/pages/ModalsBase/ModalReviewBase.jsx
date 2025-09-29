import React, { useState } from 'react';
import '../../styles/Modals.css';
import * as XLSX from 'xlsx';

const ModalReviewBase = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    archivo: null
  });

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          
          const cleanedData = json.map(row => ({
            dni: row['DNI'] || '',
            nombreCompleto: row['NOMBRES COMPLETOS'] || '',
            numero1: row['NUMERO 1'] || '',
            numero2: row['NUMERO 2'] || '',
            tipificacion: row['TIPIFICACION'] || ''
          }));
          resolve(cleanedData);
        } catch (error) {
          console.error("Error al procesar el archivo:", error);
          alert("Error al procesar el archivo. Asegúrate de que el formato sea correcto y los encabezados coincidan.");
          reject(error);
        }
      };
      reader.onerror = (error) => { reject(error); };
      reader.readAsArrayBuffer(file);
    });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.archivo && formData.nombre) {
      try {
        const datos = await processFile(formData.archivo);
        onSave({ nombre: formData.nombre, datos });
        onClose();
      } catch (error) {
        console.error("Error en el envío del formulario:", error);
      }
    } else {
      alert("Por favor, ingresa el nombre de la base y selecciona un archivo.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="review-modal-overlay">
      <div className="review-modal-container">
        <h2 className="review-modal-header">Revisar Base</h2>
        <div className="review-modal-content">
          <form onSubmit={handleSubmit}>
            <div className="review-form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Base para revisión"
                required
              />
            </div>
            <div className="review-form-group">
              <label htmlFor="archivo">Archivo</label>
              <input
                type="file"
                id="archivo"
                name="archivo"
                onChange={handleChange}
                accept=".xlsx,.xls,.csv"
                required
              />
            </div>
            <div className="review-modal-actions">
              <button type="button" onClick={onClose} className="review-btn cancel">
                CANCELAR
              </button>
              <button type="submit" className="review-btn inspect">
                INSPECCIONAR
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalReviewBase;