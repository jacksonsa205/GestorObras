import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './CardThree.css'; // Certifique-se de criar este arquivo CSS para os estilos

const CardThree = ({ tagValue, icon, title, tagColor, progressValue }) => {
  return (
    <div className="card-three">
      <div className="card-three-header">
        <div className="card-three-price-tag">
          <span className="card-three-icon"><FontAwesomeIcon icon={icon} /></span>
        </div>
        <div className="card-three-percentage" style={{ color: tagColor }}>{tagValue}</div>
      </div>
      <div className="card-three-description">{title}</div>
      <div className="card-three-progress-bar">
        <div className="card-three-progress" style={{ backgroundColor:tagColor ,width: `${progressValue * 100}%` }}></div>
      </div>
    </div>
  );
};

export default CardThree;