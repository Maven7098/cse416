// from https://www.react-graph-gallery.com/scatter-plot

import * as d3 from "d3";
import { useState } from "react";
import Tooltip from "./Tooltip";
import Axis from "./Axis";
import { regressionLinear } from "d3-regression";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 180 };

function GinglesData ({ width, height, data, race, setActivePrecinct }) {

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [hovered, setHovered] = useState(null);

  // X Axis: Minority Percent
  // Y Axis: Vote Share (Democratic)
  let currentRace = "Black / African American"
  switch (race) {
      case "HISPANIC":
        currentRace = "Hispanic / Latino";
        break;
      case "BLACK":
        currentRace = "Black / African American";
        break;
      case "ASIAN":
        currentRace = "Asian / Asian American";
        break;
    }

  // Scales
  const yScale = d3.scaleLinear().domain([0, 100]).range([boundsHeight, 0]);
  const xScale = d3.scaleLinear().domain([0, 100]).range([0, boundsWidth]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
    let activeRace = d.BLACK;

    switch (race) {
      case "HISPANIC":
        activeRace = d.HISPANIC;
        break;
      case "BLACK":
        activeRace = d.BLACK;
        break;
      case "ASIAN":
        activeRace = d.ASIAN;
        break;
    }

    return (
      <circle
        key={i}
        r={4}
        cx={xScale(100 * (activeRace / d.TOTAL))}
        cy={yScale(100 * (d.DEMOCRATIC / d.TOTAL))}
        stroke={(d.DEMOCRATIC > d.REPUBLICAN ? "#0000ff" : "#ff0000")}
        fill={(d.DEMOCRATIC > d.REPUBLICAN ? "#0000ff" : "#ff0000")}
        fillOpacity={0.7}
        onMouseEnter={() =>
          setHovered({
            xPos: xScale(100 * (activeRace / d.TOTAL)),
            yPos: yScale(100 * (d.DEMOCRATIC / d.TOTAL)),
            name: d.UNIQUE_ID,
          })
        }
        onClick={() => {
          setActivePrecinct(d.COUNT)
        }}
        onMouseLeave={() => setHovered(null)}
      />
    );
  });

  const linearRegression = regressionLinear()
    .x(d => d.x) // x-accessor
    .y(d => d.y) // y-accessor
  
  const dataDem = data.filter((precinct) => precinct.DEMOCRATIC > precinct.REPUBLICAN)
  .map((precinct) => {
    let activeRace = "BLACK"
    switch (race) {
      case "HISPANIC":
        activeRace = precinct.HISPANIC;
        break;
      case "BLACK":
        activeRace = precinct.BLACK;
        break;
      case "ASIAN":
        activeRace = precinct.ASIAN;
        break;
    }
    return{
      x: 100*activeRace/precinct.TOTAL,
      y: 100*precinct.DEMOCRATIC/precinct.TOTAL}
  })
  const resultDem = linearRegression(dataDem);
  const dataRep = data.filter((precinct) => precinct.REPUBLICAN >= precinct.DEMOCRATIC)
  .map((precinct) => {
    let activeRace = "BLACK"
    switch (race) {
      case "HISPANIC":
        activeRace = precinct.HISPANIC;
        break;
      case "BLACK":
        activeRace = precinct.BLACK;
        break;
      case "ASIAN":
        activeRace = precinct.ASIAN;
        break;
    }
    return{
      x: 100*activeRace/precinct.TOTAL,
      y: 100*precinct.REPUBLICAN/precinct.TOTAL}
  })
  const resultRep = linearRegression(dataRep);

  // 4. Use result to draw line (result.a is slope, result.b is intercept)
  const lineBuilder = d3.line()
  .x(d => xScale(d[0])) // Use the first value in the point array (x-coord)
  .y(d => yScale(d[1])); // Use the second value in the point array (y-coord)
  const demPath = lineBuilder(resultDem);
  const repPath = lineBuilder(resultRep);

  return (
    <div style={{ position: "relative" }}>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {/* Circles */}
          {allShapes}
          {/* Lines - Democratic */}
          <path
            d={demPath}
            opacity={1}
            stroke="#000088"
            fill="none"
            strokeWidth={4}
          />
          {/* Lines - Republican */}
          <path
            d={repPath}
            opacity={1}
            stroke="#880000"
            fill="none"
            strokeWidth={4}
          />
        </g>
        <Axis width={width} height={height}
        xScale={xScale} yScale={yScale}
        labelX={`${currentRace} Vote %`} labelY="Democratic Vote %" />
      </svg>

      {/* Tooltip */}
      <div
        style={{
          width: boundsWidth,
          height: boundsHeight,
          position: "absolute",
          top: 0,
          left: 0,
          pointerEvents: "none",
          marginLeft: MARGIN.left,
          marginTop: MARGIN.top,
        }}
      >
        <Tooltip interactionData={hovered} />
      </div>
    </div>
  );
};

export default GinglesData;