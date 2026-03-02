// From https://www.react-graph-gallery.com/barplot

import { useEffect, useMemo } from "react";
import * as d3 from "d3";
import titleCase from './TitleCase.js'

const MARGIN = { top: 0, right: 30, bottom: 30, left: 30 };
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
      key: titleCase(key),
      value: popData[key]
  }));

  // Y axis is for groups since the barplot is horizontal
  const groups = data.map((d) => d.key);
  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .domain(groups)
      .range([0, boundsHeight])
      .padding(BAR_PADDING);
  }, [data, height]);

  // X axis
  const xScale = useMemo(() => {
    const [min, max] = d3.extent(data.map((d) => d.value));
    return d3
      .scaleLinear()
      .domain([0, max || 10])
      .range([0, boundsWidth]);
  }, [data, width]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
    const y = yScale(d.key);
    if (y === undefined) {
      return null;
    }

    return (
      <g key={i}>
        <rect
          x={xScale(0)}
          y={yScale(d.key)}
          width={xScale(d.value)}
          height={yScale.bandwidth()}
          opacity={0.7}
          stroke="#9d174d"
          fill="#9d174d"
          fillOpacity={0.3}
          strokeWidth={1}
          rx={1}
        />
        <text
          x={xScale(d.value) - 7}
          y={y + yScale.bandwidth() / 2}
          textAnchor="end"
          alignmentBaseline="central"
          fontSize={12}
          opacity={xScale(d.value) > 90 ? 1 : 0} // hide label if bar is not wide enough
        >
          {d.value}
        </text>
        <text
          x={xScale(0) + 7}
          y={y + yScale.bandwidth() / 2}
          textAnchor="start"
          alignmentBaseline="central"
          fontSize={12}
        >
          {d.key}
        </text>
      </g>
    );
  });

  const grid = xScale
    .ticks(5)
    .slice(1)
    .map((value, i) => (
      <g key={i}>
        <line
          x1={xScale(value)}
          x2={xScale(value)}
          y1={0}
          y2={boundsHeight}
          stroke="#808080"
          opacity={0.2}
        />
        <text
          x={xScale(value)}
          y={boundsHeight + 10}
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
        <h1>{activeState.NAME}</h1>
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
