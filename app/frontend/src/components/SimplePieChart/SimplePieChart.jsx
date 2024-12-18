import React, { useState } from 'react';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const SimplePieChart = ({ data, colors }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const activeItem = activeIndex !== null ? data[activeIndex] : null;
  const percent = activeItem ? (activeItem.value / total) * 100 : null;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx={130}
          cy={120}
          outerRadius={120}
          innerRadius={80}
          fill="#8884d8"
          dataKey="value"
          isAnimationActive={false}
          onMouseEnter={onPieEnter}
          onMouseLeave={() => setActiveIndex(null)}
          cornerRadius={8} // Adiciona bordas arredondadas
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <text
          x={130}
          y={120}
          textAnchor="middle"
          dominantBaseline="middle"
          className="custom-tooltip"
        >
          {activeItem ? (
            <>
              <tspan 
                x="135" 
                dy="0" 
                style={{ fontSize: '16px', fill: '#333', fontWeight: 'bold' }}
              >
                {`${activeItem.name} : ${activeItem.value}`}
              </tspan>
              <tspan 
                x="135" 
                dy="22" 
                style={{ fontSize: '14px', fill: '#666', fontWeight: 'normal' }}
              >
                {`Share : ${percent.toFixed(2)}%`}
              </tspan>
            </>
          ) : (
            <tspan 
              x="135" 
              dy="10" 
              style={{ fontSize: '26px', fill: '#333', fontWeight: 'bold' }}
            >
              {`Total : ${total}`}
            </tspan>
          )}
        </text>
        <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SimplePieChart;