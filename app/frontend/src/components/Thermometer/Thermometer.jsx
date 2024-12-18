import React from 'react';
import { interpolateRdYlGn } from 'd3-scale-chromatic';
import './Thermometer.css'; // Certifique-se de criar um arquivo CSS para estilizar o componente

const Thermometer = ({ label, value, max ,kpi}) => {
  const circles = [];
  const filledCircles = Math.round((kpi / max) * 10);
  const colors = generateColors(10);

  for (let i = 0; i < 10; i++) {
    circles.push(
      <div
        key={i}
        className={`circle ${i < filledCircles ? 'filled' : ''}`}
        style={{ backgroundColor: i < filledCircles ? colors[i] : 'lightgray' }}
      ></div>
    );
  }

  return (
    <div className="thermometer">
      <div className="thermometer-container">
        <div className="label-section">
          <span className="label">{label}</span>
        </div>
        <div className="circles">{circles}</div>
          <span className="value">E: {value}</span>
      </div>
    </div>
  );
};

const generateColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    colors.push(interpolateRdYlGn(i / (numColors - 1)));
  }
  return colors.reverse(); // Inverte a ordem das cores
};

export default Thermometer;