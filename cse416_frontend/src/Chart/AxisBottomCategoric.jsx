import { useMemo } from "react";

// tick length
const TICK_LENGTH = 6;

function AxisBottomCategoric({ xScale }){
  const [min, max] = xScale.range();

  const ticks = useMemo(() => {
    return xScale.domain().map((value) => ({
      value,
      xOffset: xScale(value) + xScale.bandwidth() / 2,
    }));
  }, [xScale]);

  return (
    <>
      {/* Main horizontal line */}
      <path
        d={["M", min + 20, 0, "L", max - 20, 0].join(" ")}
        fill="none"
        stroke="currentColor"
      />

      {/* Ticks and labels */}
      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <line y2={TICK_LENGTH} stroke="currentColor" />
          <text
            key={value}
            style={{
              textAnchor: "middle",
              transform: "translateY(20px)",
            }}
          >
            District {value}
          </text>
        </g>
      ))}
    </>
  );
};

export default AxisBottomCategoric;