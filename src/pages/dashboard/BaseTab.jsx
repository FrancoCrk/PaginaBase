import React from 'react';
import BaseButton from '../ModalsBase/BaseButton';
import '../../styles/dashboard.css';
import '../../styles/Modals.css';

const BaseTab = ({ bases, onBaseClick, loading = false, }) => {

  if (loading) {
    return (
      <div className="tab-container">
        <div className="revising-content-modal2">
          <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      </div>
    );
  }

  return (    
    <div className="bases-container-wrapper2">
        <div className="bases-container">
        {bases.map(base => (
          <BaseButton
            key={base.id}
            nombre={base.nombre}
            fecha={base.fecha}
            onClick={() => onBaseClick(base)}
          />
        ))}
        
        {bases.length === 0 && (
        <div className="no-bases-message2">
            <p>No hay bases creadas.</p>
        </div>
        )}
        </div>
    </div>
  );
};

export default BaseTab;