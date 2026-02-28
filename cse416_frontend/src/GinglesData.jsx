// from https://www.react-graph-gallery.com/scatter-plot

import * as d3 from "d3";
import { useState } from "react";
import Tooltip from "./Tooltip";
import Axis from "./Axis";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 120 };

function GinglesData ({ width, height, data, race, setActivePrecinct }) {
  console.log(data)

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
        r={8}
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
          setActivePrecinct(d.UNIQUE_ID)
        }}
        onMouseLeave={() => setHovered(null)}
      />
    );
  });

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