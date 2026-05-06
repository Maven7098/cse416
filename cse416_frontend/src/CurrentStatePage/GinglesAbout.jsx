function GinglesAbout({activeState}) {
  return (
    <div className="leaflet-containerset">
      <div className="leaflet-container-big">
        <h1>About Gingles 2/3 Analysis</h1>
        <p>
          Display past voting pattern (e.g. 2024 Presidential voting in a state)
        </p>
        <p>Red dots for Republican vote: percentage in a precinct</p>
        <p>Blue dots for Democratic vote: percentage in a precinct</p>
        <p>
          Bubble x-axis location based on population demographic in the precinct
        </p>
        <p>{activeState == "ga" ? "Black votes are likely polarized": "Hispanic votes are likely to be polarized"}</p>
      </div>
    </div>
  );
}

export default GinglesAbout;
