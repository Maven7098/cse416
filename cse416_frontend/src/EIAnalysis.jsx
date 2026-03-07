import { useMemo } from "react";
import * as d3 from "d3";
import Axis from "./Axis";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 180 };
const COLORS = ["#e0ac2b", "#e85252"];

function EIAnalysis ({ width, height, data, race }) {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  // Only return WHITE and the matching Minority Group
  data = data.filter((group) => group.name === "WHITE" || group.name === race)

  const allGroupNames = data.map((group) => group.name);

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

  const colorScale = d3
    .scaleOrdinal()
    .domain(allGroupNames)
    .range(COLORS);

  const xScale = useMemo(() => {
    const max = Math.max(...data.map((group) => Math.max(...group.values)));
    const min = Math.min(...data.map((group) => Math.min(...group.values)));
    const range = max - min;
    return d3
      .scaleLinear()
      .domain([min - range * 0.2, max + range * 0.2]) // Add 20%: smoothing ends up out of the data bounds when drawing
      .range([10, boundsWidth])
      .nice();
  }, [data, width]);

  // Function that computes a kernel density based on an array of number
  const densityGenerator = kernelDensityEstimator(
    kernelEpanechnikov(2),
    xScale.ticks(40)
  );

  // Compute densities for all groups before drawing.
  // We need all densities to be able to know the max of the Y axis
  const densityData = data.map((group, i) => {
    const density = densityGenerator(group.values);
    return {
      name: group.name,
      density,
    };
  });

  const allYMax = densityData.map((group) =>
    Math.max(...group.density.map((d) => d[1]))
  );
  const yMax = Math.max(...allYMax);

  const yScale = useMemo(() => {
    return d3.scaleLinear().range([boundsHeight, 0]).domain([0, yMax]);
  }, [data, height]);

  const pathGenerator = d3
    .line()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .curve(d3.curveBasis);

  const allShapes = densityData.map((group, i) => {
    const path = pathGenerator(group.density);
    return (
      <path
        key={i}
        d={path}
        fill={colorScale(group.name)}
        opacity={0.4}
        stroke="black"
        strokeWidth={1}
        strokeLinejoin="round"
      />
    );
  });

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allShapes}

        {/* Build a Legend */}
        <rect
          key="BOX"
          width={220}
          height={50}
          fill="#ffffff"
          stroke="#000000"
          fillOpacity={0.6}
          x={boundsWidth - 230}
          y={-20}
        />
        <circle
          key="WHITE"
          r={6}
          cx={boundsWidth - 215}
          cy={-5}
          fill="#e0ac2b"
        />
        <circle
          key={race}
          r={6}
          cx={boundsWidth - 215}
          cy={15}
          fill="#e0ac2b"
        />
        <text x={boundsWidth - 200} y={0} alignmentBaseline="central">
          White / European American
        </text>
        <text x={boundsWidth - 200} y={20} alignmentBaseline="central">
          {currentRace}
        </text>
      </g>
      {/* Generate X and Y Axis */}
        <Axis width={width} height={height}
        xScale={xScale} yScale={yScale}
        labelX={`${currentRace} - Non ${currentRace} Vote for Democrat`} labelY="Density" />
    </svg>
  );
};

// TODO: improve types
// Function to compute density
function kernelDensityEstimator(kernel, X) {
  return function (V) {
    return X.map((x) => [x, d3.mean(V, (v) => kernel(x - v))]);
  };
}

function kernelEpanechnikov(k) {
  return function (v) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}

export default EIAnalysis;
