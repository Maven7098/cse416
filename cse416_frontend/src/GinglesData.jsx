// from https://www.react-graph-gallery.com/scatter-plot

import * as d3 from "d3";
import { AxisLeft } from "./AxisLeft";
import { AxisBottom } from "./AxisBottom";
import { useState } from "react";
import Tooltip from "./Tooltip";

const MARGIN = { top: 20, right: 30, bottom: 60, left: 30 };

function GinglesData ({ width, height, data }) {
  console.log(data)

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [hovered, setHovered] = useState(null);

  // X Axis: Minority Percent
  // Y Axis: Vote Share (Democratic)

  // Scales
  const yScale = d3.scaleLinear().domain([0, 100]).range([boundsHeight, 0]);
  const xScale = d3
    .scaleLinear()
    .domain([0, 100])
    .range([0, boundsWidth]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
    return (
      <circle
        key={i}
        r={8}
        cx={xScale(100 * (d.BLACK / d.TOTAL))}
        cy={yScale(100 * (d.DEMOCRATIC / d.TOTAL))}
        stroke={(d.DEMOCRATIC > d.REPUBLICAN ? "#0000ff" : "#ff0000")}
        fill={(d.DEMOCRATIC > d.REPUBLICAN ? "#0000ff" : "#ff0000")}
        fillOpacity={0.7}
        onMouseEnter={() =>
          setHovered({
            xPos: xScale(100 * (d.BLACK / d.TOTAL)),
            yPos: yScale(100 * (d.DEMOCRATIC / d.TOTAL)),
            name: d.ID,
          })
        }
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
          {/* Y axis */}
          <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} />

          {/* X axis, use an additional translation to appear at the bottom */}
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom
              xScale={xScale}
              pixelsPerTick={40}
              height={boundsHeight}
            />
          </g>

          {/* Circles */}
          {allShapes}
        </g>
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