import { useEffect, useMemo } from "react";
import * as d3 from "d3";
import titleCase from './TitleCase.js'

const MARGIN = { top: 0, right: 30, bottom: 30, left: 30 };
const BAR_PADDING = 0.3;

function Population({ width, height, districtData }){
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // TODO Today (Feb 18):
  // Catch 2 birds in 1 stone - GUI-3 and GUI-6
  // How can we display the state data alongside the district data?
  // Ideally we should implement a go back button as well
  // Additionally, if we change state maps, the districtData should also be wiped out

    useEffect(()=>{
        console.log(districtData)
    },[districtData])

    // Process districtData to only leave numerical values
    const {ID, AREA, DISTRICT, GEOID, WINNER, REPRESENT, RRACE, WMARGIN, TOTAL, ...popData} = districtData;
    // popData should be converted to Key/Value pairs of arrays to work w/ D3 
    const data = Object.keys(popData).map(key => ({
        key: titleCase(key),
        value: popData[key]
    }));

  // Y axis is for groups since the barplot is horizontal
  const groups = data.map((d) => d.key);
  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .domain(groups)
      .range([0, boundsHeight])
      .padding(BAR_PADDING);
  }, [data, height]);

  // X axis
  const xScale = useMemo(() => {
    const [min, max] = d3.extent(data.map((d) => d.value));
    return d3
      .scaleLinear()
      .domain([0, max || 10])
      .range([0, boundsWidth]);
  }, [data, width]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
    const y = yScale(d.key);
    if (y === undefined) {
      return null;
    }

    return (
      <g key={i}>
        <rect
          x={xScale(0)}
          y={yScale(d.key)}
          width={xScale(d.value)}
          height={yScale.bandwidth()}
          opacity={0.7}
          stroke="#9d174d"
          fill="#f9efc4"
          fillOpacity={0.3}
          strokeWidth={1}
          rx={1}
        />
        <text
          x={xScale(d.value) - 7}
          y={y + yScale.bandwidth() / 2}
          textAnchor="end"
          alignmentBaseline="central"
          opacity={xScale(d.value) > 90 ? 1 : 0} // hide label if bar is not wide enough
        >
          {d.value}
        </text>
        <text
          x={xScale(0) + 7}
          y={y + yScale.bandwidth() / 2}
          textAnchor="start"
          alignmentBaseline="central"
        >
          {d.key}
        </text>
      </g>
    );
  });

  const grid = xScale
    .ticks(5)
    .slice(1)
    .map((value, i) => (
      <g key={i}>
        <line
          x1={xScale(value)}
          x2={xScale(value)}
          y1={0}
          y2={boundsHeight}
          stroke="#808080"
          opacity={0.2}
        />
        <text
          x={xScale(value)}
          y={boundsHeight + 10}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize={9}
          stroke="#808080"
          opacity={0.8}
        >
          {value}
        </text>
      </g>
    ));

  return (
    <div>
        <h3>District No.: {districtData.DISTRICT}</h3>
        <h5>District GeoID: {districtData.GEOID}</h5>
      <div>
        <p style={{margin: "2px"}}>Current Representative: {districtData.REPRESENT}</p>
        <p style={{margin: "2px"}}>Race of Current Representative: {districtData.RRACE}</p>
        <p style={{margin: "2px"}}>Margin of Victory: {districtData.WMARGIN}</p>
      </div>
      <svg width={width} height={height}>
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

export default Population;
