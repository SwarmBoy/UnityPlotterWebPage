import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  Customized,
} from 'recharts';


const DroneMap = ({ latestEntry }) => {

  if(Object.keys(latestEntry).length === 0){
    return <p>Map loading...</p>;
  }

  const droneVariables = Object.keys(latestEntry).filter((key) => key.includes('Drone'));

  const dronesData = [];

  droneVariables.forEach((key) => {
    if(key.includes('position')){
      dronesData.push({
        name: key.split('_')[0],
        x: latestEntry[key][0],
        z: latestEntry[key][2],
        y: latestEntry[key][1],
        name: key,
      });
    }
  });
 
  // Extract map variables
  const mapCenterX = latestEntry["map_center_position"][0];
  const mapCenterZ = latestEntry["map_center_position"][2];
  const mapData = latestEntry['map_data'];
  //as float
  const mapCellSize = parseFloat(latestEntry['map_cell_size']);

  if (
    mapCenterX === undefined ||
    mapCenterZ === undefined ||
    mapData === undefined ||
    mapCellSize === undefined
  ) {
    return <p>Map data is incomplete</p>;
  }

  const mapWidth = Math.sqrt(mapData.length);
  const mapHeight = Math.sqrt(mapData.length);

  // Prepare the cell data
  const cells = [];
  const cellSize = mapCellSize;
  const halfWidth = (mapWidth * cellSize) / 2;
  const halfHeight = (mapHeight * cellSize) / 2;
  for (let i = 0; i < mapHeight; i++) {
    for (let j = 0; j < mapWidth; j++) {
      const x = mapCenterX - halfWidth + i * cellSize;
      const z = mapCenterZ - halfHeight + j * cellSize;
      const value = mapData[i * mapWidth + j];
      cells.push({ x, z, value });
    }
  }



  // Determine the bounds of the map for scaling
  const xMin = mapCenterX - halfWidth;
  const xMax = mapCenterX + halfWidth;
  const zMin = mapCenterZ - halfHeight;
  const zMax = mapCenterZ + halfHeight;


  return (
    <div>
      <h2>Drone Map</h2>
      <ScatterChart
        width={600}
        height={600}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
      >
        <XAxis
          type="number"
          dataKey="x"
          domain={[xMin, xMax]}
          label={{ value: 'X Position', position: 'insideBottomRight', offset: -10 }}
          tick={false}
        />
        <YAxis
          type="number"
          dataKey="z"
          domain={[zMin, zMax]}
          label={{ value: 'Z Position', angle: -90, position: 'insideLeft' }}
          tick={false}
        />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        {/* Render the grid cells */}
        {<Customized component={(props) => <GridCells {...props} cells={cells} cellSize={cellSize} />} /> }
        {/* Render the drone positions */}
        <Scatter
          name="Drones"
          data={dronesData}
          fill="#ff0000"
          shape="circle"
          legendType="circle"
        />
      </ScatterChart>
    </div>
  );
};



const GridCells = (props) => {
  const { cells, cellSize, xAxisMap, yAxisMap } = props;

  const xAxis = xAxisMap[0]; // Assuming default xAxis
  const yAxis = yAxisMap[0]; // Assuming default yAxis

  const xScale = xAxis.scale;
  const yScale = yAxis.scale;

  return (
    <g>
      {cells.map((cell, index) => {
        const { x, z, value } = cell;
        const fill = value == 1 ? '#000000' : '#FFFFFF'; // Black for occupied, white for free

        // Map data coordinates to pixel positions
        const xPos = xScale(x);
        const yPos = yScale(z + cellSize);
        const width = xScale(x + cellSize) - xScale(x);
        const height = yScale(z) - yScale(z + cellSize);

        return (
          <rect
            key={index}
            x={xPos}
            y={yPos}
            width={width}
            height={height}
            fill={fill}
          />
        );
      })}
    </g>
  );
};



export default DroneMap;
