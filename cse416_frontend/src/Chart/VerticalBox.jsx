// From https://www.react-graph-gallery.com/boxplot

const STROKE_WIDTH = 40;

// A reusable component that builds a vertical box shape using svg
// Note: numbers here are px, not the real values in the dataset.

function VerticalBox({
  min,
  q1,
  median,
  q3,
  max,
  width,
  stroke,
  fill,
  clipPath
}){
  return (
    <>
      <line
        x1={width / 2}
        x2={width / 2}
        y1={min > 0 ? min : 0}
        y2={max}
        stroke={stroke}
        width={STROKE_WIDTH}
        clipPath={clipPath}
      />
      <rect
        x={0}
        y={q3}
        width={width}
        height={q1 - q3}
        stroke={stroke}
        fill={fill}
        clipPath={clipPath}
      />
      <line
        x1={0}
        x2={width}
        y1={median}
        y2={median}
        stroke={stroke}
        width={STROKE_WIDTH}
        clipPath={clipPath}
      />
    </>
  );
};

export default VerticalBox;