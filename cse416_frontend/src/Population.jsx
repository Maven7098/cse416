import { useEffect } from "react";
import * as d3 from 'd3';

function Population({districtData}){
    const width = 400; const height = 600;
    
    useEffect(()=>{
        console.log(districtData)
    },[districtData])

    // Process districtData to only leave numerical values
    const {ID, AREA, DISTRICT, GEOID, WINNER, ...popData} = districtData;
    // popData should be converted to Key/Value pairs of arrays to work w/ D3 
    const data = Object.keys(popData).map(key => ({
        key: key,
        value: popData[key]
    }));

    useEffect(()=>{
        console.log(data)
    },[data])
    
    // Build a chart with D3 now
    // Set up margins and dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const chartWidth = height - margin.top - margin.bottom;
    const chartHeight = width - margin.left - margin.right;
    // Create scales
    const x = d3.scaleLinear().domain([0, d3.max(data, (d) => d.value)]).range([0, chartHeight]);
    const y = d3
        .scaleBand()
        .domain(data.map((d) => d.key))
        .range([0, chartHeight])
        .padding(0.1);

    return(
        <div>
            <h1>District No.: {districtData.DISTRICT}</h1>
            <h3>District GeoID: {districtData.GEOID}</h3>
            <svg width={height} height={width}>
                <g transform={`translate(${margin.left},${margin.top})`}>
                    {/* Bars */}
                    {data.map((d) => (
                    <rect
                        x={x(0)}
                        y={y(d.key)}
                        width={x(d.value)}
                        height={y.bandwidth()}
                        fill="steelblue"
                    />
                    ))}
                    {/* Axes */}
                    <g
                    className="x-axis"
                    transform={`translate(0,${chartHeight})`}
                    ref={(node) => d3.select(node).call(d3.axisBottom(x))}
                    />
                    <g className="y-axis" ref={(node) => d3.select(node).call(d3.axisLeft(y))} />
                </g>
            </svg>
        </div>
    );
};

export default Population;