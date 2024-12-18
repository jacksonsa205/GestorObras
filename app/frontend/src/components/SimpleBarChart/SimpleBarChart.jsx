import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const SimpleBarChart = ({ data, colors }) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
      <XAxis dataKey="name" />
      <YAxis padding={{ bottom: 5 }} />
      <Tooltip contentStyle={{ boxShadow: 'transparent' }} />
      <Bar dataKey="value" name="Total" fill={colors} radius={[8, 8, 8, 8]} />
    </BarChart>
  </ResponsiveContainer>
);

export default SimpleBarChart;