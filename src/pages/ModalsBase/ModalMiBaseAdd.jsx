import React, { useState } from 'react';
import '../../styles/Modals.css';
import * as XLSX from 'xlsx';

const ModalMiBaseAdd = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    dia: '',
    crearBlanco: false,
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
            tipificacion: row['TIPIFICACION'] || '' // <- Se agregó un manejo para valores nulos
          }));

          resolve(cleanedData);
        } catch (error) {
          console.error("Error al procesar el archivo:", error);
          alert("Error al procesar el archivo. Asegúrate de que el formato sea correcto y los encabezados coincidan.");
          reject(error);
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.crearBlanco) {
      onSave({ ...formData, datos: [] });
      onClose();
    } else if (formData.archivo) {
      try {
        const datos = await processFile(formData.archivo);
        onSave({ ...formData, datos });
        onClose();
      } catch (error) {
        console.error("Error al procesar el archivo:", error);
        alert("Error al procesar el archivo. Asegúrate de que el formato sea correcto y los encabezados coincidan.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-header">Agregar Nueva Base</h2>

        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nombre">Nombre de la Base</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Base Clientes May-2025"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="dia">Fecha</label>
              <input
                type="date"
                id="dia"
                name="dia"
                value={formData.dia}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="crearBlanco"
                  checked={formData.crearBlanco}
                  onChange={handleChange}
                />
                Crear Base en Blanco
              </label>
            </div>
            
            <div className="form-group">
              <label htmlFor="archivo">Archivo</label>
              <input
                type="file"
                id="archivo"
                name="archivo"
                onChange={handleChange}
                accept=".xlsx,.xls,.csv"
                disabled={formData.crearBlanco}
              />
              <small className="file-notice">
                Formatos aceptados: .xlsx, .xls, .csv
              </small>
            </div>
            
            <div className="modal-actions">
              <button type="button" onClick={onClose} className="btn cancel">
                CANCELAR
              </button>
              <button type="submit" className="btn save">
                SUBIR
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalMiBaseAdd;