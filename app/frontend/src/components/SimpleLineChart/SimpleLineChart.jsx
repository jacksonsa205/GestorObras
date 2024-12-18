import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SimpleLineChart = ({ data, lines }) => (
  <ResponsiveContainer width="100%" height={250}>
    <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
      {/* <CartesianGrid strokeDasharray="3 3" /> */}
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      {lines.map((line, index) => (
        <Line
          key={index}
          type="monotone"
          dataKey={line.dataKey}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth || 2}
        />
      ))}
    </LineChart>
  </ResponsiveContainer>
);

export default SimpleLineChart;