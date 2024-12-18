import React, { useEffect, useState } from 'react';
import GaugeChart from 'react-gauge-chart';
import { interpolateRdYlGn } from 'd3-scale-chromatic';
import './CustomGaugeChart.css';

const CustomGaugeChart = ({ valueKPI, maxKPI, value, max, title }) => {
  const KPI = valueKPI / maxKPI;
  const percent = value / max;

  const formattedPercent = percent.toLocaleString('pt-BR', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Função para gerar uma lista de cores interpoladas entre vermelho e verde
  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(interpolateRdYlGn(i / (numColors - 1)));
    }
    return colors.reverse(); // Inverte a ordem das cores
  };

  const colors = generateColors(30);

  // Estado para armazenar a classe CSS do desvio
  const [desvioClass, setDesvioClass] = useState('');

  useEffect(() => {
    const desvioValue = parseFloat(formattedPercent.replace('%', ''));
    if (desvioValue > 100) {
      setDesvioClass('red');
    } else {
      setDesvioClass('green');
    }
  }, [formattedPercent]);

  return (
    <div className='custom-gauge-chart-section'>
      <h3 className='custom-gauge-chart-title'>{title}</h3>
      <GaugeChart
        id="gauge-chart"
        nrOfLevels={30}
        colors={colors}
        arcWidth={0.3}
        percent={KPI}
        textColor="#000000"
        formatTextValue={(KPI) => `KPI: ${KPI}%`}
      />
      <div className='custom-gauge-chart-value-section'>
        <div className='custom-gauge-chart-value'>Entrante: <span>{value}</span></div>
        <div className='custom-gauge-chart-value'>Média: <span>{max}</span></div>
        <div className='custom-gauge-chart-value'>Desvio: <span id="desvio" className={desvioClass}>{formattedPercent}</span></div>
        <div className='custom-gauge-chart-value'>Massivas: <span>30</span></div>
      </div>
    </div>
  );
};

export default CustomGaugeChart;