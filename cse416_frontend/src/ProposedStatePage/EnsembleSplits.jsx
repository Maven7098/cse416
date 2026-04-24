// From https://www.react-graph-gallery.com/barplot

import { useMemo } from "react";
import * as d3 from "d3";

const MARGIN = { top: 0, right: 60, bottom: 50, left: 60 };
const BAR_PADDING = 0.3;

function EnsembleSplits({ width, height, data }){
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return <div style={{ padding: "1rem" }}>No ensemble split data is available.</div>;
  }

  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Democrat / Republican Split
  // KEY: "5/9" (5 Democrat, 9 Republican) / VALUE: Number of proposed maps with this split
  const {NAME, ...popData} = data;
  const eData = Object.keys(popData).map(key => ({
      name: key,
      value: Number(popData[key])
  })).filter((d) => Number.isFinite(d.value));

  if (eData.length === 0) {
    return <div style={{ padding: "1rem" }}>No ensemble split data is available.</div>;
  }

  // X axis is for groups since the barplot is vertical
  const groups = eData.map((d) => d.name);
  const xScale = d3
    .scaleBand()
    .domain(groups)
    .range([0, boundsWidth])
    .padding(BAR_PADDING);

  // Y axis
  const max = d3.max(eData.map((d) => d.value)) ?? 10;
  const yScale = d3
    .scaleLinear()
    .domain([max * 1.2, 0])
    .range([0, boundsHeight]);

  // Build the shapes
  const allShapes = eData.map((d, i) => {
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
          {d.value}
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
        {value}
      </text>
    </g>
  ));

  return (
    <div>
      <svg width={width} height={height+40}>
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

export default EnsembleSplits;
