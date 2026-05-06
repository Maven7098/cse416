function EIAbout({activeState}) {
  return (
    <div className="leaflet-containerset">
      <div className="leaflet-container-big">
        <h1>About EI (Ecological Inference) Analysis</h1>
        <p>Statistical data analysis</p>
        <p>
          Estimates individual-level voting behavior using aggregate data,
          typically voting patterns of racial/language groups
        </p>
        <p>Produces probability voting curves</p>
        <p>Use PyEI software</p>
        <p>{activeState == "ga" ? "Black votes are likely polarized": "Hispanic votes are likely to be polarized"}</p>
      </div>
    </div>
  );
}
export default EIAbout;
