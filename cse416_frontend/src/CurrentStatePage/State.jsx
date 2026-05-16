// From https://www.react-graph-gallery.com/barplot

import { useMemo } from "react";
import * as d3 from "d3";
import titleCase from "../Chart/TitleCase.js";

const MARGIN = { top: 0, right: 50, bottom: 44, left: 50 };
const BAR_PADDING = 0.3;

function State({ width, height, activeState, activeRace, currentRace }) {
  if(activeState == []){
    return <p>Nothing to see here...</p>
  }
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // TODO Today (Feb 18):
  // Catch 2 birds in 1 stone - GUI-3 and GUI-6
  // How can we display the state data alongside the district data?
  // Ideally we should implement a go back button as well

  // Process activeState to only leave numerical values
  const {
    NAME,
    DSEAT,
    RSEAT,
    DVOTE,
    RVOTE,
    PARTY,
    TOTAL,
    DIST,
    HISPANIC_PER,
    BLACK_PER,
    ASIAN_PER,
    WHITE_PER,
    OTHER_PER,
    HISPANIC_EFF,
    BLACK_EFF,
    ASIAN_EFF,
    WHITE_EFF,
    OTHER_EFF,
    HISPANIC_DIST,
    BLACK_DIST,
    ASIAN_DIST,
    WHITE_DIST,
    OTHER_DIST,
    HISPANIC_MAJ,
    BLACK_MAJ,
    ASIAN_MAJ,
    WHITE_MAJ,
    OTHER_MAJ,
    ...popData
  } = activeState;
  // popData should be converted to Key/Value pairs of arrays to work w/ D3
  const data = Object.keys(popData).map((key) => ({
    name: titleCase(key),
    value: popData[key]
  }));

  let minorityPercent = 0;
  let minorityEffective = 0;
  let minorityMajority = 0;
  switch (activeRace) {
    case "HISPANIC":
      minorityPercent = activeState.HISPANIC_PER;
      minorityEffective = activeState.HISPANIC_DIST;
      minorityMajority = activeState.HISPANIC_MAJ;
      break;
    case "BLACK":
      minorityPercent = activeState.BLACK_PER;
      minorityEffective = activeState.BLACK_DIST;
      minorityMajority = activeState.BLACK_MAJ;
      break;
    case "ASIAN":
      minorityPercent = activeState.ASIAN_PER;
      minorityEffective = activeState.ASIAN_DIST;
      minorityMajority = activeState.ASIAN_MAJ;
      break;
    case "WHITE":
      minorityPercent = activeState.WHITE_PER;
      minorityEffective = activeState.WHITE_DIST;
      minorityMajority = activeState.WHITE_MAJ;
      break;
  }

  // X axis is for groups since the barplot is vertical
  const groups = data.map((d) => d.name);
  const xScale = d3
    .scaleBand()
    .domain(groups)
    .range([0, boundsWidth])
    .padding(BAR_PADDING);

  // Y axis
  console.log(data)
  const max = Math.max(...data.map((d) => d.value)) ?? 10;
  console.log(max)
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
        >
          {Number(d.value).toLocaleString()}
        </text>
        <text
          x={x + xScale.bandwidth() / 2}
          y={boundsHeight + 20}
          textAnchor="middle"
          alignmentBaseline="central"
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
        stroke="#808080"
        opacity={0.8}
      >
        {value.toLocaleString()}
      </text>
    </g>
  ));

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          flexDirection: "row",
          textAlign: "center",
        }}
      >
        <div style={{ flexDirection: "column" }}>
          <h4>Democrats</h4>
          <p style={{ marginBottom: "2px" }}>
            Number of Seats: {activeState.DSEAT}
          </p>
          <p style={{ marginBottom: "2px" }}>
            2024 Presidential Voter %: {activeState.DVOTE}%
          </p>
        </div>
        <div style={{ flexDirection: "column" }}>
          <h4>Republicans</h4>
          <p style={{ marginBottom: "2px" }}>
            Number of Seats: {activeState.RSEAT}
          </p>
          <p style={{ marginBottom: "2px" }}>
            2024 Presidential Voter %: {activeState.RVOTE}%
          </p>
        </div>
      </div>
      <h4 style={{ margin: "1em" }}>
        Current Districting Party: {activeState.PARTY == "D" ? "Democratic" : "Republican"}
      </h4>
      <h5>
        {currentRace} Effective Districts: {minorityEffective}
      </h5>
      <h5>
        {currentRace} Majority Districts: {minorityMajority}
      </h5>
      <h5>
        {currentRace} Proportionality:{" "}
      {((minorityEffective / (activeState.DSEAT + activeState.RSEAT)) / (minorityPercent)).toFixed(3)}
      </h5>
      <br />
      <h4>Population</h4>
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
}

export default State;
