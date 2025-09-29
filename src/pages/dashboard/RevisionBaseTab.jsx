import React, { useState, useEffect } from 'react';
import '../../styles/dashboard.css';
import ModalReviewBase from '../ModalsBase/ModalReviewBase';
import ModalStatus from '../ModalsBase/ModalStatus';
import ReviewResultsTable from './ReviewResultsTable'; 
import backIcon from "../../assets/back.png";
import revisionIcon from "../../assets/revision.png";
import uploadIcon from "../../assets/upload.png";

// Base de datos de números bloqueados
const blockedNumbersDB = [
  "904896057", "907890878", "924785943", "926332428", "926693751",
  "930762802", "932112418", "935265982", "947359123", "947985385",
  "950239206", "954627362", "957023868", "958674254", "958674746",
  "970960749", "971957290", "972179274", "980985004", "984587789",
  "987523990", "989037422", "989300074", "990894545", "993584534",
  "993584568", "993584688", "994270634", "996661620", "997101018",
  "997101025", "997101036", "997101372", "997101936", "997102501",
  "997102542", "997104357", "997104705", "997104740", "997109119",
  "997181606", "997510097", "997997843", "998140773"
];

// Prefijos para números sospechosos
const suspiciousPrefixesDB = [
  "99710", "99358", "98752", "98665", "99751"
];

const RevisionBaseTab = ({ onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [viewState, setViewState] = useState("initial");
  const [foundMatches, setFoundMatches] = useState([]);
  const [foundSuspicious, setFoundSuspicious] = useState([]);
  const [reviewedBaseName, setReviewedBaseName] = useState('');
  const [isTableVisible, setIsTableVisible] = useState(false);
  const [baseData, setBaseData] = useState([]);
  const [processedData, setProcessedData] = useState([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async (data) => {
    handleCloseModal();
    setReviewedBaseName(data.nombre);
    setBaseData(data.datos);
  };

  useEffect(() => {
    if (baseData.length > 0) {
      const matches = [];
      const suspicious = [];
      
      const blockedNumbersSet = new Set(blockedNumbersDB);
      const suspiciousPrefixesSet = new Set(suspiciousPrefixesDB);
      
      const newProcessedData = baseData.map((row, index) => {
        const numero1Value = (row.numero1 || '').toString().trim();
        const numero2Value = (row.numero2 || '').toString().trim();

        let numero1Type = 'Normal';
        let numero2Type = 'Normal';
        
        const isNum1Blocked = blockedNumbersSet.has(numero1Value);
        const isNum2Blocked = blockedNumbersSet.has(numero2Value);
        
        const isNum1Suspicious = suspiciousPrefixesSet.has(numero1Value.substring(0, 5));
        const isNum2Suspicious = suspiciousPrefixesSet.has(numero2Value.substring(0, 5));

        if (isNum1Blocked) {
            numero1Type = 'blackList';
            matches.push(numero1Value);
        } else if (isNum1Suspicious) {
            numero1Type = 'sospechoso';
            suspicious.push(numero1Value);
        }

        if (isNum2Blocked) {
            numero2Type = 'blackList';
            matches.push(numero2Value);
        } else if (isNum2Suspicious) {
            numero2Type = 'sospechoso';
            suspicious.push(numero2Value);
        }

        return {
            ...row,
            id: row.id || index,
            numero1: {
                value: numero1Value,
                type: numero1Type
            },
            numero2: {
                value: numero2Value,
                type: numero2Type
            }
        };
      });

      setProcessedData(newProcessedData);
      setFoundMatches(matches);
      setFoundSuspicious(suspicious);

      if (matches.length > 0 || suspicious.length > 0) {
        setViewState("con_coincidencias");
      } else {
        setViewState("sin_coincidencias");
      }
      
      setIsStatusModalOpen(true);
    }
  }, [baseData]);

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
  };

  const handleReviewTable = () => {
    handleCloseStatusModal();
    setIsTableVisible(true);
  };

  const handleBackFromTable = () => {
    setIsTableVisible(false);
  };

  const renderContent = () => {
    if (isTableVisible) {
      return (
        <ReviewResultsTable
          onBack={handleBackFromTable}
          baseName={reviewedBaseName}
          reviewData={{ matches: foundMatches, suspicious: foundSuspicious }}
          completeData={processedData}
        />
      );
    }
    return (
      <div className="revision-content">
        <img src={revisionIcon} alt="Revisión" className="revision-icon" />
        <button className="upload-btn" onClick={handleOpenModal}>
          <img src={uploadIcon} alt="Subir Base" className="upload-icon" />
          Subir Base
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="header-with-actions">
        <button className="back-btn2" onClick={onBack}>
          <img src={backIcon} alt="Volver" className="back-icon2" />
          Volver
        </button>
      </div>
      <div className="tab-container">
        <div className="revision-main-container">
          {renderContent()}
        </div>
      </div>
      <ModalReviewBase
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
      <ModalStatus
        isOpen={isStatusModalOpen}
        onClose={handleCloseStatusModal}
        viewState={viewState}
        foundMatches={foundMatches}
        foundSuspicious={foundSuspicious}
        onReviewTable={handleReviewTable}
      />
    </>
  );
};

export default RevisionBaseTab;