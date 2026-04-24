// From https://www.react-graph-gallery.com/barplot

import { useMemo } from "react";
import * as d3 from "d3";

const MARGIN = { top: 0, right: 60, bottom: 50, left: 60 };
const BAR_PADDING = 0.3;

function MinorityEffectivenessHistogram({ width, height, vraData, nonVraData }){
  if (!vraData || typeof vraData !== "object" || Array.isArray(vraData) || !nonVraData || typeof nonVraData !== "object" || Array.isArray(nonVraData)) {
    return <div style={{ padding: "1rem" }}>No Minority Effeciveness Histogram is available.</div>;
  }

  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Keys: "6" (6 minority effective districts)
  // Value: How many cases have 6 minority effectiveness districts
  const eDataVra = Object.keys(vraData).map(key => ({
      name: key,
      value: Number(popDataVra[key])
  })).filter((d) => Number.isFinite(d.value));
  const eDataNonVra = Object.keys(nonVraData).map(key => ({
      name: key,
      value: Number(popDataNonVra[key])
  })).filter((d) => Number.isFinite(d.value));

  if (eDataVra.length === 0) {
    return <div style={{ padding: "1rem" }}>No ensemble split data is available.</div>;
  }

  // X axis is for groups since the barplot is vertical
  const groups = eDataVra.map((d) => d.name);
  const xScale = d3
    .scaleBand()
    .domain(groups)
    .range([0, boundsWidth])
    .padding(BAR_PADDING);

  // Y axis
  const max = d3.max(eDataVra.map((d) => d.value)) ?? 10;
  const yScale = d3
    .scaleLinear()
    .domain([max * 1.2, 0])
    .range([0, boundsHeight]);

  // Build the shapes
  const allShapes = (data, color) => {data.map((d, i) => {
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
          fill={color}
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
  })};

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
          {allShapes(eDataVra, "#f9efc4")}
          {allShapes(eDataVra, "#f9efc4")}
        </g>
      </svg>
    </div>
  );
};

export default MinorityEffectivenessHistogram;
