import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";

const MARGIN = { top: 30, right: 30, bottom: 50, left: 180 };

function Axis({ width, height, xScale, yScale, labelX="", labelY="" }){
  // Layout. The div size is set by the given props.
  // The bounds (=area inside the axis) is calculated by substracting the margins
  const axesRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // X axis
  // const xScale = useMemo(() => {
  //   return d3.scaleLinear().domain([0, 10]).range([0, boundsWidth]);
  // }, [width]);

  // Y axis
  // const yScale = useMemo(() => {
  //   return d3.scaleLinear().domain([0, 10]).range([boundsHeight, 0]);
  // }, [height]);

  // Render the X and Y axis using d3.js, not react
  useEffect(() => {
    const svgElement = d3.select(axesRef.current);
    svgElement.selectAll("*").remove();
    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);
    svgElement
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", boundsWidth / 2)
      .attr("y", boundsHeight + 40)
      .text(labelX);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g")
        .call(yAxisGenerator);
    svgElement
      .append("text")
      .attr("text-anchor", "middle")
      .attr("x", "-6em")
      .attr("y", boundsHeight / 2)
      .text(labelY);
  }, [xScale, yScale, boundsHeight, labelX, labelY]);

  return (
    <g
    width={boundsWidth}
    height={boundsHeight}
    ref={axesRef}
    transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
    />
  );
};

export default Axis;