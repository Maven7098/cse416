function DatasetAbout() {
  return (
    <div className="leaflet-containerset">
      <div className="leaflet-container-big">
        <h1>About Datasets</h1>
        <p>Datasets are displayed as 256_High, 4096_Medium...</p>
        <p>256_High means...</p>
        <p><b>256</b>: Number of precincts generated. Can be...</p>
        <p style={{ margin: "2px" }}>256: 256 precincts generated (sample set)</p>
        <p style={{ margin: "2px" }}>or</p>
        <p>4096: 4096 precincts generated (production set)</p>
        <p><b>High</b>: High Effectiveness Threshold. Can be...</p>
        <p style={{ margin: "2px" }}>High: High Effeciveness Threshold of 0.75 (75%)</p>
        <p style={{ margin: "2px" }}>or</p>
        <p style={{ margin: "2px" }}>Medium: Medium Effeciveness Threshold of 0.6 (60%)</p>
        <p style={{ margin: "2px" }}>or</p>
        <p>Low: Low Effeciveness Threshold of 0.5 (50%)</p>
      </div>
    </div>
  );
}

export default DatasetAbout;
