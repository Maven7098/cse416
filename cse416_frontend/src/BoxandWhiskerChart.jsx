import { useMemo } from "react";
import * as d3 from "d3";
import SummaryStats from "./SummaryStats.jsx";
import AxisLeft from "./AxisLeft";
import AxisBottom from "./AxisBottomCategoric";
import VerticalBox from "./VerticalBox";

const MARGIN = { top: 30, right: 30, bottom: 30, left: 50 };

function BoxandWhiskerChart({ width, height, data }){
  // The bounds (= area inside the axis) is calculated by substracting the margins from total width / height
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  const numberData = data.filter((d) => d.name !== "Enacted" && d.name !== "Proposed").sort( function (a, b){ return a.value - b.value });
  const circleDataEnacted = data.filter((d) => d.name === "Enacted").map((d) => d.value);
  const circleDataProposed = data.filter((d) => d.name === "Proposed").map((d) => d.value);
  console.log(circleDataProposed)

  // Compute everything derived from the dataset:
  const { chartMin, chartMax, groups } = useMemo(() => {
    const [chartMin, chartMax] = d3.extent(data.map((d) => d.value))
    const groups = [...new Set(numberData.map((d) => d.name))];
    return { chartMin, chartMax, groups };
  }, [data]);

  // Compute scales
  const yScale = d3
    .scaleLinear()
    .domain([chartMin, chartMax])
    .range([boundsHeight, 0]);
  const xScale = d3
    .scaleBand()
    .range([0, boundsWidth])
    .domain(groups)
    .padding(0.25);

  let countEnacted = 0;
  const allEnactedCircles = circleDataEnacted.map((value, i) => {
    countEnacted++;
    return (
    <circle
      key={i}
      // Only keep one per district
      cx={xScale(countEnacted.toString()) + xScale.bandwidth() / 2}
      cy={yScale(value)}
      r={6}
      fill="#E31A1C"
      fillOpacity={0.8}
    />
    )
});
  let countProposed = 0;
  const allProposedCircles = circleDataProposed.map((value, i) => {
    countProposed++;
    return (
    <circle
      key={i}
      cx={xScale(countProposed.toString()) + xScale.bandwidth() / 2}
      cy={yScale(value)}
      r={6}
      fill="#800026"
      fillOpacity={0.8}
    />
    )
  });
  // Build the box shapes
  const allShapes = groups.map((group, i) => {
    // Do not put "Enacted" and "Proposed" into box charts
    // Put them into circles instead
    const groupNumberData = numberData.filter((d) => d.name === group).map((d) => d.value);
    const sumStats = SummaryStats(groupNumberData);

    if (!sumStats) {
      return null;
    }

    const { min, q1, median, q3, max } = sumStats;

    // Put "Enacted" and "Proposed" into circle charts

    return (
      <g key={i} transform={`translate(${xScale(group)},0)`}>
        <VerticalBox
          width={xScale.bandwidth()}
          q1={yScale(q1)}
          median={yScale(median)}
          q3={yScale(q3)}
          min={yScale(min)}
          max={yScale(max)}
          stroke="black"
          fill={"#FFEDA0"}
        />
      </g>
    );
  });

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {allShapes}
          {allEnactedCircles}
          {allProposedCircles}
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
          key="ENACTED"
          r={6}
          cx={boundsWidth - 195}
          cy={-5}
          fill="#E31A1C"
        />
        <circle
          key="PROPOSED"
          r={6}
          cx={boundsWidth - 195}
          cy={15}
          fill="#800026"
        />
        <text x={boundsWidth - 180} y={0} alignmentBaseline="central">
          Enacted Plan
        </text>
        <text x={boundsWidth - 180} y={20} alignmentBaseline="central">
          Proposed Plan
        </text>
          <AxisLeft yScale={yScale} pixelsPerTick={30} />
          {/* X axis uses an additional translation to appear at the bottom */}
          <g transform={`translate(0, ${boundsHeight})`}>
            <AxisBottom xScale={xScale} />
          </g>
        </g>
      </svg>
    </div>
  );
};

export default BoxandWhiskerChart;