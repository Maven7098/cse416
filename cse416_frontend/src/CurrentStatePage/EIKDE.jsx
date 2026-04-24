import { useMemo } from "react";
import * as d3 from "d3";
import Axis from "../Chart/Axis";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 180 };

function EIKDE ({ width, height, data, race }) {
  if (!data || data.length === 0) {
    return <div style={{ padding: "1rem" }}>EI KDE data is not available yet.</div>;
  }

  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
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

  const xScale = useMemo(() => {
    // const max = Math.max(...data);
    return d3
      .scaleLinear()
      .domain([0, 1000]) // note: limiting to 1000 instead of max here because of extreme values in the dataset
      .range([10, boundsWidth - 10]);
  }, [data, width]);

  // Compute kernel density estimation
  // const density = useMemo(() => {
  //   const kde = kernelDensityEstimator(kernelEpanechnikov(7), xScale.ticks(40));
  //   return kde(data);
  // }, [xScale]);
  const density = data.data;
  console.log(density)

  const yScale = useMemo(() => {
    const max = Math.max(...density.map((d) => d[1]));
    return d3.scaleLinear().range([boundsHeight, 0]).domain([0, max]);
  }, [data, height]);

  const path = useMemo(() => {
    const lineGenerator = d3
      .line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]))
      .curve(d3.curveBasis);
    return lineGenerator(density);
  }, [density]);

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        <path
          d={path}
          fill="#9a6fb0"
          opacity={0.4}
          stroke="black"
          strokeWidth={1}
          strokeLinejoin="round"
        />
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

export default EIKDE;
