import * as d3 from "d3";

const MARGIN = { top: 10, right: 50, bottom: 44, left: 50 };
const BAR_PADDING = 0.3;
import titleCase from "../Chart/TitleCase";
import { useState } from "react";

function District({ activeRace, currentRace, width, height, districtData }) {
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  let minorityCalculated = "";
  let minorityCalibrated = "";
  let minorityEffective = "";
  let minorityMajority = "";
  switch (activeRace) {
    case "HISPANIC":
      minorityCalculated = districtData.HISPANIC_EFF;
      minorityCalibrated = districtData.HISPANIC_CALB;
      minorityEffective = districtData.HISPANIC_DIST;
      minorityMajority = districtData.HISPANIC_MAJ;
      break;
    case "BLACK":
      minorityCalculated = districtData.BLACK_EFF;
      minorityCalibrated = districtData.BLACK_CALB;
      minorityEffective = districtData.BLACK_DIST;
      minorityMajority = districtData.BLACK_MAJ;
      break;
    case "ASIAN":
      minorityCalculated = districtData.ASIAN_EFF;
      minorityCalibrated = districtData.ASIAN_CALB;
      minorityEffective = districtData.ASIAN_DIST;
      minorityMajority = districtData.ASIAN_MAJ;
      break;
    case "WHITE":
      minorityCalculated = districtData.WHITE_EFF;
      minorityCalibrated = districtData.WHITE_CALB;
      minorityEffective = districtData.WHITE_DIST;
      minorityMajority = districtData.WHITE_MAJ;
      break;
  }

  // Process districtData to only leave numerical values
  const {
    ID,
    AREA,
    DISTRICT,
    GEOID,
    WINNER,
    REPRESENT,
    RRACE,
    WMARGIN,
    TOTAL,
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
    HISPANIC_CALB,
    BLACK_CALB,
    ASIAN_CALB,
    WHITE_CALB,
    OTHER_CALB,
    ...popData
  } = districtData;
  // popData should be converted to Key/Value pairs of arrays to work w/ D3
  const data = Object.keys(popData).map((key) => ({
    name: titleCase(key),
    value: popData[key],
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
        >
          {d.value.toLocaleString()}
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
      <h4>District No.: {districtData.DISTRICT}</h4>
      <h5>
        {currentRace} Calculated Score: {Number(minorityCalculated).toFixed(5)}
      </h5>
      <h5>
        {currentRace} Calibrated Score: {Number(minorityCalibrated).toFixed(5)}
      </h5>
      <h5>
        {currentRace} Effective District:{" "}
        {minorityEffective == 1 ? "True" : "False"}
      </h5>
      <h5>
        {currentRace} Majority District:{" "}
        {minorityMajority == 1 ? "True" : "False"}
      </h5>
      <div style={{ marginBottom: "0" }}>
        <p style={{ margin: "2px" }}>
          Representative: {districtData.REPRESENT} | Margin:{" "}
          {districtData.WMARGIN}
        </p>
        {districtData.WINNER == "D" ? (
          <p style={{ margin: "2px" }}>Party of Representative: Democrat</p>
        ) : ( districtData.WINNER == "R" ? (
          <p style={{ margin: "2px" }}>Party of Representative: Republican</p>
        ) : ( <p style={{ margin: "2px" }}>Party of Representative: None</p> ))}
        <p style={{ margin: "2px" }}>
          Race/Ethnicity of Representative: {districtData.RRACE}
        </p>
      </div>
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
export default District;
