import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons'; // Importa os ícones de seta
import './CardTwo.css'; // Importa o arquivo de estilos CSS

export const CardTwo = ({ icon, title, value, upDown, valueModalRegional, valueModalContrato, modalContrato, tituloRegional, tituloContrato, collapse, width }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    if (collapse) {
      setIsModalOpen(!isModalOpen); 
    }
  };

  const renderValues = (value) => {
    if (typeof value === 'string') {
      return value.split(',').map((item, index) => (
        <div key={index} className="value">{item}</div>
      ));
    } else {
      return <div className="value">{value}</div>;
    }
  };

  return (
    <div style={{ width: width }}>
      <div className="cardTwo" onClick={handleCardClick}>
        <div className="cardTwo-content">
          <div className="cardTwo-icon-circle">
            <FontAwesomeIcon icon={icon} className="circle-icon" />
          </div>
          <div className="cardTwo-info">
            <div className="cardTwo-section">
              <div className='cardTwo-value'>
                {value}
                <FontAwesomeIcon 
                  icon={faCircleDot} 
                  className="arrow-icon" 
                  style={{ color: upDown === 0 ? 'red' : upDown === 1 ? 'green' : '#39374e' }}
                />
              </div>
              <div className='cardTwo-title'>{title}</div>
            </div>
          </div>
        </div>
      </div>
      {collapse && isModalOpen && (
        <div className="modal-cardTwo">
          <div className="modal-cardTwo-content">
            <div className="modal-cardTwo-info">
              <div className='modal-cardTwo-title'>{tituloRegional}</div>
              <div className='modal-cardTwo-value'>
                {renderValues(valueModalRegional)}
                <FontAwesomeIcon 
                  icon={faCircleDot} 
                  className="arrow-icon" 
                  style={{ color: upDown === 0 ? 'red' : upDown === 1 ? 'green' : '#39374e',
                  fontSize: '10px' }}
                /></div>
              <div className='modal-cardTwo-title'>{tituloContrato}</div>
              <div className='modal-cardTwo-value'>
                {renderValues(valueModalContrato)}
                <FontAwesomeIcon 
                  icon={faCircleDot} 
                  className="arrow-icon" 
                  style={{ color: upDown === 0 ? 'red' : upDown === 1 ? 'green' : '#39374e',
                  fontSize: '10px' }}
                /></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};