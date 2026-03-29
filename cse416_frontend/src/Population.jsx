import * as d3 from 'd3';

const MARGIN = { top: 10, right: 60, bottom: 50, left: 60 };
const BAR_PADDING = 0.3;
import titleCase from './TitleCase';

function Population({ width, height, districtData }){
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Process districtData to only leave numerical values
  const {ID, AREA, DISTRICT, GEOID, WINNER, REPRESENT, RRACE, WMARGIN, TOTAL, ...popData} = districtData;
  // popData should be converted to Key/Value pairs of arrays to work w/ D3 
  const data = Object.keys(popData).map(key => ({
      name: titleCase(key),
      value: popData[key]
  }));

  // X axis is for groups since the barplot is vertical
  const groups = data.map((d) => d.name);
  const xScale = d3
    .scaleBand()
    .domain(groups)
    .range([0, boundsWidth])
    .padding(BAR_PADDING);

  // Y axis
  const max = d3.max(data.map((d) => d.value)) ?? 10;
  const yScale = d3
    .scaleLinear()
    .domain([max * 1.2, 0])
    .range([0, boundsHeight]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
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
      <h3>District No.: {districtData.DISTRICT}</h3>
      <h5>District GeoID: {districtData.GEOID}</h5>
    <div style={{marginBottom: "0"}}>
      <p style={{margin: "2px"}}>Rep: {districtData.REPRESENT} | Margin: {districtData.WMARGIN}</p>
      <p style={{margin: "2px"}}>Rep Race: {districtData.RRACE}</p>
    </div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
        >
          {grid}
          {allShapes}
        </g>
      </svg>
    </div>
  );
};
export default Population;