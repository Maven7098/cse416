// from https://www.react-graph-gallery.com/scatter-plot

import * as d3 from "d3";
import { useState } from "react";
import Tooltip from "../Chart/Tooltip";
import Axis from "../Chart/Axis";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 65 };

function GinglesData({
  width,
  height,
  data,
  line,
  activeRace,
  currentRace,
  setActivePrecinct,
}) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "1rem" }}>
        No polarization data is available for this state.
      </div>
    );
  }

  // Force re-render and animation trigger when activeRace changes
  const key = `${activeRace}-${data.length}`;

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const [hovered, setHovered] = useState(null);

  // X Axis: Minority Percent
  // Y Axis: Vote Share (Democratic)
  // Calculate data extents for dynamic scaling
  const xValues = data.map((d) => {
    let precincts = null;
    switch (activeRace) {
      case "HISPANIC":
        precincts = d.HISPANIC;
        break;
      case "BLACK":
        precincts = d.BLACK;
        break;
      case "ASIAN":
        precincts = d.ASIAN;
        break;
      case "WHITE":
        precincts = d.WHITE;
        break;
    }
    return 100 * (precincts / d.TOTAL);
  });

  const yValues = data.map((d) => 100 * (d.TOTAL_DEM / d.TOTAL));

  const xMin = Math.max(0, d3.min(xValues) - 5);
  const xMax = Math.min(100, d3.max(xValues) + 5);
  const yMin = Math.max(0, d3.min(yValues) - 5);
  const yMax = Math.min(100, d3.max(yValues) + 5);

  // Scales with dynamic domains based on actual data
  const yScale = d3.scaleLinear().domain([yMin, yMax]).range([boundsHeight, 0]);
  const xScale = d3.scaleLinear().domain([xMin, xMax]).range([0, boundsWidth]);

  // Sort data by x-value (minority percentage) for left-to-right loading
  const sortedData = [...data].sort((a, b) => {
    let activeRaceA = a.BLACK;
    let activeRaceB = b.BLACK;
    switch (activeRace) {
      case "HISPANIC":
        activeRaceA = a.HISPANIC;
        activeRaceB = b.HISPANIC;
        break;
      case "BLACK":
        activeRaceA = a.BLACK;
        activeRaceB = b.BLACK;
        break;
      case "ASIAN":
        activeRaceA = a.ASIAN;
        activeRaceB = b.ASIAN;
        break;
      case "WHITE":
        activeRaceA = a.WHITE;
        activeRaceB = b.WHITE;
        break;
    }
    return 100 * (activeRaceA / a.TOTAL) - 100 * (activeRaceB / b.TOTAL);
  });

  // Calculate animation timing: axes first, then points, then lines
  const axisStartDelay = 0;
  const axisDuration = 0.1;
  const pointsStartDelay = axisStartDelay + axisDuration; // 0.1s
  const lastPointDelay = (data.length - 1) * 0.0007;
  const pointAnimDuration = 0.1;
  const lineStartDelay =
    pointsStartDelay + pointAnimDuration + lastPointDelay + 0.01; // small buffer

  // Build the shapes
  const allShapes = sortedData.map((d, i) => {
    let precincts = null;

    switch (activeRace) {
      case "HISPANIC":
        precincts = d.HISPANIC;
        break;
      case "BLACK":
        precincts = d.BLACK;
        break;
      case "ASIAN":
        precincts = d.ASIAN;
        break;
      case "WHITE":
        precincts = d.WHITE;
        break;
    }

    return (
      <>
        <circle
          key={`${i}-dem`}
          r={4}
          cx={xScale(100 * (precincts / d.TOTAL))}
          cy={yScale(100 * (d.TOTAL_DEM / d.TOTAL))}
          stroke="#0000ff"
          fill="#0000ff"
          fillOpacity={0.7}
          onMouseEnter={() =>
            setHovered({
              xPos: xScale(100 * (precincts / d.TOTAL)),
              yPos: yScale(100 * (d.TOTAL_DEM / d.TOTAL)),
              name: d.ID,
            })
          }
          onClick={() => {
            setActivePrecinct(d);
          }}
          onMouseLeave={() => setHovered(null)}
          style={{
            animation: `circlesFadeIn 0.1s ease-out forwards ${pointsStartDelay + i * 0.0007}s`,
            opacity: 0,
          }}
        />
        <circle
          key={`${i}-rep`}
          r={4}
          cx={xScale(100 * (precincts / d.TOTAL))}
          cy={yScale(100 * (d.TOTAL_REP / d.TOTAL))}
          stroke="#ff0000"
          fill="#ff0000"
          fillOpacity={0.7}
          onMouseEnter={() =>
            setHovered({
              xPos: xScale(100 * (precincts / d.TOTAL)),
              yPos: yScale(100 * (d.TOTAL_DEM / d.TOTAL)),
              name: d.ID,
            })
          }
          onClick={() => {
            setActivePrecinct(d);
          }}
          onMouseLeave={() => setHovered(null)}
          style={{
            animation: `circlesFadeIn 0.1s ease-out forwards ${pointsStartDelay + i * 0.0007}s`,
            opacity: 0,
          }}
        />
      </>
    );
  });

  const dataDem = data
    .filter((precinct) => precinct.TOTAL_DEM > precinct.TOTAL_REP)
    .map((precinct) => {
      let precincts = precinct.BLACK;
      switch (activeRace) {
        case "HISPANIC":
          precincts = precinct.HISPANIC;
          break;
        case "BLACK":
          precincts = precinct.BLACK;
          break;
        case "ASIAN":
          precincts = precinct.ASIAN;
          break;
        case "WHITE":
          precincts = precinct.WHITE;
          break;
      }
      return {
        x: (100 * precincts) / precinct.TOTAL,
        y: (100 * precinct.TOTAL_DEM) / precinct.TOTAL,
      };
    });
  const dataRep = data
    .filter((precinct) => precinct.TOTAL_REP >= precinct.TOTAL_DEM)
    .map((precinct) => {
      let precincts = precinct.BLACK;
      switch (activeRace) {
        case "HISPANIC":
          precincts = precinct.HISPANIC;
          break;
        case "BLACK":
          precincts = precinct.BLACK;
          break;
        case "ASIAN":
          precincts = precinct.ASIAN;
          break;
        case "WHITE":
          precincts = precinct.WHITE;
          break;
      }
      return {
        x: (100 * precincts) / precinct.TOTAL,
        y: (100 * precinct.TOTAL_REP) / precinct.TOTAL,
      };
    });

    // Constants for y = a * e^(b * x) + c
    const aDem = line.TOTAL_DEM[0], bDem = line.TOTAL_DEM[1], cDem = line.TOTAL_DEM[2]
    const aRep = line.TOTAL_REP[0], bRep = line.TOTAL_REP[1], cRep = line.TOTAL_REP[2]
    // Line for Democrat and Republican respectively
    const resultDem = d3.range(0, 100, 0.1).map(x => ({
      x: x,
      y: (aDem * Math.exp(bDem * x) + cDem)  // Exponential formula
    }));
    const resultRep = d3.range(0, 100, 0.1).map(x => ({
      x: x,
      y: (aRep * Math.exp(bRep * x) + cRep) // Exponential formula
    }));

    // Use result to draw line (result.a is slope, result.b is intercept)
    const lineBuilder = d3
      .line()
      .x((d) => xScale(d.x)) // Use the first value in the point array (x-coord)
      .y((d) => yScale(d.y)); // Use the second value in the point array (y-coord)
    const demPath = lineBuilder(resultDem);
    const repPath = lineBuilder(resultRep);

  return (
    <div style={{ position: "relative" }} key={key}>
      <style>{`
        @keyframes circlesFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 0.7;
          }
        }
        @keyframes pathsFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
      <svg width={width} height={height}>
        <defs>
          <clipPath id="gridClip">
            <rect x={0} y={0} width={boundsWidth} height={boundsHeight} />
          </clipPath>
        </defs>
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
            clipPath="url(#gridClip)"
            style={{
              animation: `pathsFadeIn 0.1s ease-out forwards ${lineStartDelay}s`,
              opacity: 0,
            }}
          />
          {/* Lines - Republican */}
          <path
            d={repPath}
            opacity={1}
            stroke="#880000"
            fill="none"
            strokeWidth={4}
            clipPath="url(#gridClip)"
            style={{
              animation: `pathsFadeIn 0.1s ease-out forwards ${lineStartDelay + 0.01}s`,
              opacity: 0,
            }}
          />
          {/* Build a Legend */}
          <rect
            key="BOX"
            width={120}
            height={50}
            fill="#ffffff"
            stroke="#000000"
            fillOpacity={0.6}
            x={boundsWidth - 110}
            y={-20}
          />
          <circle
            key="TOTAL_DEM"
            r={6}
            cx={boundsWidth - 90}
            cy={-5}
            fill="#0000ff"
          />
          <circle
            key="TOTAL_REP"
            r={6}
            cx={boundsWidth - 90}
            cy={15}
            fill="#ff0000"
          />
          <text x={boundsWidth - 75} y={0} alignmentBaseline="central">
            Democratic
          </text>
          <text x={boundsWidth - 75} y={20} alignmentBaseline="central">
            Republican
          </text>
        </g>
        <g
          style={{
            animation: `pathsFadeIn ${axisDuration}s ease-out forwards ${axisStartDelay}s`,
            opacity: 0,
          }}
        >
          <Axis
            width={width}
            height={height}
            xScale={xScale}
            yScale={yScale}
            labelX={`${currentRace} Population %`}
            labelY="Democratic Vote %"
          />
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
}

export default GinglesData;
