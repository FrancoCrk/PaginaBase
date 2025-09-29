import React, { useState, forwardRef, useImperativeHandle } from "react";
import * as XLSX from "xlsx";
import "../../styles/dashboard.css";
import "../../styles/Modals.css";
import ModalMiBaseAdd from "../ModalsBase/ModalMiBaseAdd";
import BaseButton from "../ModalsBase/BaseButton";
import BaseDataTab from "./BaseDataTab";
import backIcon from "../../assets/back.png";
import addIcon from "../../assets/agregar.png";

const MiBaseTab = ({ bases, onSaveBase, onBaseClick, onBack, subTitle, isAdvisorView, loading = false }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [baseName, setBaseName] = useState("");
  const [baseDate, setBaseDate] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = () => {
    if (!file) {
      alert("Por favor, selecciona un archivo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        const formattedData = json.slice(1).map((row) => ({
          dni: row[0] || '',
          nombreCompleto: row[1] || '', // Corregido: usar nombreCompleto
          numero1: row[2] || '', // Corregido: usar numero1
          numero2: row[3] || '', // Corregido: usar numero2
          tipificacion: row[4] || '',
        }));

        const newBaseData = {
          nombre: file.name.split(".")[0],
          dia: new Date().toISOString().split('T')[0], // Añadir la fecha actual
          datos: formattedData,
        };

        // Solo usar onSaveBase - el Dashboard maneja el resto
        onSaveBase(newBaseData);
        setIsModalOpen(false);
        setFile(null); // Limpiar el archivo seleccionado
      } catch (error) {
        alert("Error al procesar el archivo. Asegúrate de que sea un Excel válido.");
        console.error("Error al importar el archivo:", error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleLocalSave = (baseData) => {
    onSaveBase(baseData); // Llama a la función del padre
    setIsAddModalOpen(false);
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="admin-tab">
        <div className="header-with-actions">
          <button className="back-btn2" onClick={onBack}>
            <img src={backIcon} alt="Volver" className="back-icon2" />
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
      <div className="header-with-actions">
        <button className="back-btn2" onClick={onBack}>
          <img src={backIcon} alt="Volver" className="back-icon2" />
          Volver
        </button>
        {/* Botón de Agregar, visible solo en la vista de lista */}
        <button className="add-btn2" onClick={handleAdd}>
          <img src={addIcon} alt="Agregar" className="add-icon2" />
        </button>
      </div>

      <div className="bases-container-wrapper">
        <div className="bases-container">
          {bases.map(base => (
            <BaseButton
              key={base.id}
              nombre={base.nombre}
              fecha={base.fecha}
              onClick={() => onBaseClick(base)}
            />
          ))}
        </div>

        {bases.length === 0 && (
          <div className="no-bases-message">
            <p>No hay bases creadas.</p>
            <p>Haz click en + para agregar una.</p>
          </div>
        )}
      </div>

      <ModalMiBaseAdd
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleLocalSave}
      />
    </div>
  );
};

export default MiBaseTab;