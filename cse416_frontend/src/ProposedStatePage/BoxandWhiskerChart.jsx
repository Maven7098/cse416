import { useMemo } from "react";
import * as d3 from "d3";
import SummaryStats from "../Chart/SummaryStats";
import AxisLeft from "../Chart/AxisLeft";
import AxisBottom from "../Chart/AxisBottomCategoric";
import VerticalBox from "../Chart/VerticalBox";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };

function BoxandWhiskerChart({ width, height, activeRace, data }){
// The bounds (= area inside the axis) is calculated by substracting the margins from total width / height
const boundsWidth = width - MARGIN.right - MARGIN.left;
const boundsHeight = height - MARGIN.top - MARGIN.bottom;
if (!data || data.length === 0) {
    return <div style={{ padding: "1rem" }}>EI analysis data is not available yet.</div>;
}

// Get all values matching specific minority group
let minority;
switch(activeRace){
    case "HISPANIC":
        minority = data
        .filter(item => item.HISPANIC !== undefined) // Optional: filter out missing
        .map(item => item.HISPANIC);
        break;
    case "BLACK":
        minority = data
        .filter(item => item.BLACK !== undefined) // Optional: filter out missing
        .map(item => item.BLACK);
        break;
    case "ASIAN":
        minority = data
        .filter(item => item.ASIAN !== undefined) // Optional: filter out missing
        .map(item => item.ASIAN);
        break;
  }
  
  const ungrouped = minority.map(item => {
    return Object.entries(item).map(([key, value]) => ({
    name: key, value: value
  }))}).flat();
  console.log(ungrouped)

  const numberData = ungrouped.sort( function (a, b){ return a.value - b.value });
  // const circleDataEnacted = circleData.filter((d) => d.name === "Enacted").map((d) => d.value);

  // Compute everything derived from the Dataset:
  const { chartMin, chartMax, groups } = useMemo(() => {
    const [chartMin, chartMax] = d3.extent(ungrouped.map((d) => d.value))
    const groups = [...new Set(numberData.map((d) => d.name))];
    return { chartMin, chartMax, groups };
  }, [ungrouped]);

  // Compute scales
  const yScale = d3
    .scaleLinear()
    .domain([0, chartMax])
    .range([boundsHeight, 0]);
  const xScale = d3
    .scaleBand()
    .range([0, boundsWidth])
    .domain(groups)
    .padding(0.25);

  // let countEnacted = 0;
//   const allEnactedCircles = circleDataEnacted.map((value, i) => {
//     countEnacted++;
//     return (
//     <circle
//       key={i}
//       // Only keep one per district
//       cx={xScale(countEnacted.toString()) + xScale.bandwidth() / 2}
//       cy={yScale(value)}
//       r={6}
//       fill="#E31A1C"
//       fillOpacity={0.8}
//     />
//     )
// });
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
        <defs>
            <clipPath id="gridClip">
            <rect x={0} y={0} width={boundsWidth} height={boundsHeight} />
            </clipPath>
          </defs>
        <VerticalBox
          width={xScale.bandwidth()}
          q1={yScale(q1)}
          median={yScale(median)}
          q3={yScale(q3)}
          min={yScale(min)}
          max={yScale(max)}
          stroke="black"
          fill={"#FFEDA0"}
          clipPath="url(#gridClip)"
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
          <defs>
            <clipPath id="gridClip">
            <rect x={0} y={0} width={boundsWidth} height={boundsHeight} />
            </clipPath>
          </defs>
          {allShapes}
          {/* {allEnactedCircles} */}
        {/* Build a Legend */}
        <rect
          key="BOX"
          width={270}
          height={50}
          fill="#ffffff"
          stroke="#000000"
          fillOpacity={0.6}
          x={boundsWidth - 260}
          y={-20}
        />
        {/* <circle
          key="ENACTED"
          r={6}
          cx={boundsWidth - 245}
          cy={-5}
          fill="#E31A1C"
        /> */}
        <rect
          key="MINORITY"
          width={12}
          height={12}
          x={boundsWidth - 251}
          y={9}
          fill="#ffeda0"
        />
        <text x={boundsWidth - 230} y={0} alignmentBaseline="central">
          Enacted Plan Minority Percentage
        </text>
        <text x={boundsWidth - 230} y={20} alignmentBaseline="central">
          Selected Minority Percentage
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