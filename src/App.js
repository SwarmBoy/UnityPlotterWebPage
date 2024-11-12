import React, { useState, useEffect } from 'react';
import DroneMap from './DroneMap';
import VariableSelector from './VariableSelector';
import LinePlot from './LinePlot';

const App = () => {
  // State variables for different data parts
  const [data, setData] = useState([]);
  const [fullHistory, setFullHistory] = useState([]);
  const [lastValues, setLastValues] = useState([]);

  const [fullHistoryVariables, setFullHistoryVariables] = useState([]);
  const [lastValuesVariables, setLastValuesVariables] = useState([]);

  const [selectedVariables, setSelectedVariables] = useState([]);

  useEffect(() => {
    // Fetch and process data periodically
    const fetchData = () => {
      fetch('http://localhost:5000/data')
        .then((response) => response.json())
        .then((fetchedData) => {
          // Process fullHistory and lastValues separately
          const { full_history, last_values } = fetchedData;

          if (full_history) {
            const processedFullHistory = processFullHistory(full_history);
            setFullHistory(processedFullHistory);
            //get all the keys
            const keys = Object.keys(processedFullHistory);
            setFullHistoryVariables(keys);
          }

          if (last_values) {
            const processedLastValues = processLastValues(last_values);
            setLastValues(processedLastValues);
            //get all the keys\
            const keys = Object.keys(processedLastValues);
            setLastValuesVariables(keys);
          }
        })
        .catch((error) => console.error('Error fetching data:', error));
    };

    const intervalId = setInterval(fetchData, 100);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  // Helper function to parse and transform string coordinates into objects
  const parseCoordinateString = (str) => {
    const [x, y, z] = str
      .slice(1, -1) // Remove parentheses
      .split(',')
      .map((num) => parseFloat(num.trim())); // Convert to numbers
    return { x, y, z };
  };

  // Process fullHistory data
  const processFullHistory = (fullHistory) => {
    return fullHistory;
  };

  // Process lastValues data
  const processLastValues = (lastValues) => {
    const processedValues = {};

    Object.keys(lastValues).forEach((key) => {
      const value = lastValues[key];

      if (typeof value === 'string' && value.startsWith('(')) {
        // Parse position/velocity string
        processedValues[key] = parseCoordinateString(value);
      } else {
        // Keep non-coordinate values as-is
        processedValues[key] = value;
      }
    });

    return processedValues;
  };

  // Extract variables for visualization
  useEffect(() => {
  }, [fullHistory, lastValues]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dynamic Drone Data Plotter</h1>
      <DroneMap
        latestEntry={lastValues}
      ></DroneMap>
      <VariableSelector
        variables={fullHistoryVariables}
        selectedVariables={selectedVariables}
        setSelectedVariables={setSelectedVariables}
      />
      <LinePlot data={fullHistory} selectedVariables={selectedVariables} />
    </div>
  );
};

export default App;
