// From https://www.react-graph-gallery.com/barplot

import { useEffect, useMemo } from "react";
import * as d3 from "d3";
import titleCase from './TitleCase.js'

const MARGIN = { top: 0, right: 60, bottom: 30, left: 60 };
const BAR_PADDING = 0.3;

function State({ width, height, activeState }){
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // TODO Today (Feb 18):
  // Catch 2 birds in 1 stone - GUI-3 and GUI-6
  // How can we display the state data alongside the district data?
  // Ideally we should implement a go back button as well

  // Process activeState to only leave numerical values
  const {NAME, DSEAT, RSEAT, DVOTE, RVOTE, PARTY, TOTAL, ...popData} = activeState;
  // popData should be converted to Key/Value pairs of arrays to work w/ D3 
  const data = Object.keys(popData).map(key => ({
      name: titleCase(key),
      value: popData[key]
  }));

  // X axis is for groups since the barplot is vertical
  const groups = data.map((d) => d.name);
  const xScale = d3
    .scaleBand()
    .domain(groups)
    .range([0, boundsWidth])
    .padding(BAR_PADDING);

  // Y axis
  const max = d3.max(data.map((d) => d.value)) ?? 10;
  const yScale = d3
    .scaleLinear()
    .domain([max * 1.2, 0])
    .range([0, boundsHeight]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
    const x = xScale(d.name);
    if (x === undefined) {
      return null;
    }

    return (
      <g key={i}>
        <rect
          x={x}
          y={yScale(d.value)}
          width={xScale.bandwidth()}
          height={boundsHeight - yScale(d.value)}
          opacity={0.9}
          stroke="#9d174d"
          fill="#f9efc4"
          fillOpacity={0.3}
          strokeWidth={1}
          rx={1}
        />
        <text
          x={x + xScale.bandwidth() / 2}
          y={yScale(d.value) - 10}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize={12}
        >
          {d.value}
        </text>
        <text
          x={x + xScale.bandwidth() / 2}
          y={boundsHeight + 10}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize={12}
        >
          {d.name}
        </text>
      </g>
    );
  });

  const grid = yScale.ticks(5).map((value, i) => (
    <g key={i}>
      <line
        x1={0}
        x2={boundsWidth}
        y1={yScale(value)}
        y2={yScale(value)}
        stroke="#808080"
        opacity={0.2}
      />
      <text
        x={-10}
        y={yScale(value)}
        textAnchor="middle"
        alignmentBaseline="central"
        fontSize={9}
        stroke="#808080"
        opacity={0.8}
      >
        {value}
      </text>
    </g>
  ));

  return (
    <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent:"space-evenly", flexDirection: "row", textAlign: "center"}}>
            <div style={{flexDirection: "column"}}>
                <h3>Democrats:</h3>
                <p style={{marginBottom: "2px"}}>Number of Seats: {activeState.DSEAT}</p>
                <p style={{marginBottom: "2px"}}>Voter %: {activeState.DVOTE}%</p>
            </div>
            <div style={{flexDirection: "column"}}>
                <h3>Republicans:</h3>
                <p style={{marginBottom: "2px"}}>Number of Seats: {activeState.RSEAT}</p>
                <p style={{marginBottom: "2px"}}>Voter %: {activeState.RVOTE}%</p>
            </div>
        </div>
        <p style={{margin: "1em"}}>Current Districting Party: {activeState.PARTY}</p>
        <h3>Total Population: {activeState.TOTAL}</h3>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {grid}
          {allShapes}
        </g>
      </svg>
    </div>
  );
};

export default State;
