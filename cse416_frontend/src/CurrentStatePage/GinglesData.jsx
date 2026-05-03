// from https://www.react-graph-gallery.com/scatter-plot

import * as d3 from "d3";
import { useState } from "react";
import Tooltip from "../Chart/Tooltip";
import Axis from "../Chart/Axis";
import { regressionExp } from "d3-regression";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 65 };

function GinglesData({
  width,
  height,
  data,
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
    let activeRace = d.BLACK;
    switch (activeRace) {
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
    return 100 * (activeRace / d.TOTAL);
  });

  const yValues = data.map((d) => 100 * (d.DEMOCRATIC / d.TOTAL));

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
    let activeRace = d.BLACK;

    switch (activeRace) {
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
      <>
        <circle
          key={`${i}-dem`}
          r={4}
          cx={xScale(100 * (activeRace / d.TOTAL))}
          cy={yScale(100 * (d.DEMOCRATIC / d.TOTAL))}
          stroke="#0000ff"
          fill="#0000ff"
          fillOpacity={0.7}
          onMouseEnter={() =>
            setHovered({
              xPos: xScale(100 * (activeRace / d.TOTAL)),
              yPos: yScale(100 * (d.DEMOCRATIC / d.TOTAL)),
              name: d.UNIQUE_ID,
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
          cx={xScale(100 * (activeRace / d.TOTAL))}
          cy={yScale(100 * (d.REPUBLICAN / d.TOTAL))}
          stroke="#ff0000"
          fill="#ff0000"
          fillOpacity={0.7}
          onMouseEnter={() =>
            setHovered({
              xPos: xScale(100 * (activeRace / d.TOTAL)),
              yPos: yScale(100 * (d.DEMOCRATIC / d.TOTAL)),
              name: d.UNIQUE_ID,
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

  const exponentialRegression = regressionExp()
    .x((d) => d.x) // x-accessor
    .y((d) => d.y); // y-accessor

  const dataDem = data
    .filter((precinct) => precinct.DEMOCRATIC > precinct.REPUBLICAN)
    .map((precinct) => {
      let activeRace = precinct.BLACK;
      switch (activeRace) {
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
      return {
        x: (100 * activeRace) / precinct.TOTAL,
        y: (100 * precinct.DEMOCRATIC) / precinct.TOTAL,
      };
    });
  const resultDem = exponentialRegression(dataDem);
  const dataRep = data
    .filter((precinct) => precinct.REPUBLICAN >= precinct.DEMOCRATIC)
    .map((precinct) => {
      let activeRace = precinct.BLACK;
      switch (activeRace) {
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
      return {
        x: (100 * activeRace) / precinct.TOTAL,
        y: (100 * precinct.REPUBLICAN) / precinct.TOTAL,
      };
    });
  const resultRep = exponentialRegression(dataRep);

  // 4. Use result to draw line (result.a is slope, result.b is intercept)
  const lineBuilder = d3
    .line()
    .x((d) => xScale(d[0])) // Use the first value in the point array (x-coord)
    .y((d) => yScale(d[1])); // Use the second value in the point array (y-coord)
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
            width={220}
            height={50}
            fill="#ffffff"
            stroke="#000000"
            fillOpacity={0.6}
            x={boundsWidth - 210}
            y={-20}
          />
          <circle
            key="DEMOCRATIC"
            r={6}
            cx={boundsWidth - 195}
            cy={-5}
            fill="#0000ff"
          />
          <circle
            key="REPUBLICAN"
            r={6}
            cx={boundsWidth - 195}
            cy={15}
            fill="#ff0000"
          />
          <text x={boundsWidth - 180} y={0} alignmentBaseline="central">
            Democratic Precincts
          </text>
          <text x={boundsWidth - 180} y={20} alignmentBaseline="central">
            Republican Precincts
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
            labelX={`${currentRace} Vote %`}
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
