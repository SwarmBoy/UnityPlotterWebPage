import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const colors = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#d0ed57',
  '#a4de6c',
  '#8dd1e1',
  '#83a6ed',
  '#8e4585',
  '#ff6f61',
  '#6b5b95',
];

const calculatePercentile = (data, percentile) => {
  const sorted = [...data].sort((a, b) => a - b);
  const index = Math.floor((percentile / 100) * (sorted.length - 1));
  return sorted[index];
};

const LinePlot = ({ data, selectedVariables }) => {
  if (selectedVariables.length === 0)
    return <p>No variables selected or data unavailable.</p>;

  if (!data.hasOwnProperty('timestamp'))
    return <p>Timestamp is not available in the data.</p>;

  // Prepare data with timestamps
  const plotData = data.timestamp.map((timestamp, index) => {
    const entry = { timestamp };
    selectedVariables.forEach((variable) => {
      entry[variable] = data[variable][index];
    });
    return entry;
  });

  // Collect all values for selected variables
  const allValues = selectedVariables
    .flatMap((variable) => data[variable]);

  // Calculate 5th and 95th percentiles
  const minValue = Math.floor(calculatePercentile(allValues, 5)) - 1;
  const maxValue = Math.floor(calculatePercentile(allValues, 95)) + 1;

  return (
    <div>
      <h2>Selected Variables Over Time</h2>
      <LineChart
        width={800}
        height={400}
        data={plotData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" tickFormatter={(tick) => tick.split(' ')[1]} />
        <YAxis domain={[minValue > 0 ? 0 : minValue, maxValue < 10 ? 10 : maxValue]} />
        <Tooltip />
        <Legend />
        {selectedVariables.map((variable, index) => (
          <Line
            key={variable}
            type="monotone"
            dataKey={variable}
            stroke={colors[index % colors.length]}
            dot={false}
          />
        ))}
      </LineChart>
    </div>
  );
};

export default LinePlot;
