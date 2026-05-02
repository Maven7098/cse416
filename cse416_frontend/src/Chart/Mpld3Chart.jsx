import React, { useEffect } from "react";
import mpld3 from "mpld3";

const Mpld3Chart = ({ data, figId }) => {
  useEffect(() => {
    // Clear existing figure to prevent duplicate rendering in dev mode
    mpld3.remove_figure(figId);
    // Render the specific chart data into the div with this figId
    mpld3.draw_figure(figId, data);
  }, [data, figId]); // Re-run if data or ID changes

  return <div id={figId} style={{ marginBottom: "10px" }}></div>;
};

export default Mpld3Chart;
