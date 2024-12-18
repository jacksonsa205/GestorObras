import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './CardOne.css';

const CardOne = ({ tagValue, icon, title, tagColor }) => {
  return (
    <div className="cardOne">
      <div className="cardOne-tag" style={{ backgroundColor: tagColor }}>{tagValue}</div>
      <div className="cardOne-icon"><FontAwesomeIcon icon={icon} /></div>
      <div className="cardOne-title">{title}</div>
    </div>
  );
}

export default CardOne;