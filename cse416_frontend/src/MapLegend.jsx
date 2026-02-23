import React, { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';
import './MapLegend.css'

const Legend = ({ grades, colors, title }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      const legend = L.control({ position: 'bottomright' });

      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'info legend');
        let labels = [``]; // Start with an empty array or initial title

        // Add title if provided
        if (title) {
            labels.push(`<strong>${title}</strong>`);
        }

        // Loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < grades.length; i++) {
          labels.push(
            `<i style="background: ${colors[i]}"></i>` +
            grades[i] + (grades[i + 1] ? ` &ndash; ${grades[i + 1]}` : '+')
          );
        }

        div.innerHTML = labels.join('<br>');
        return div;
      };

      legend.addTo(map);

      // Cleanup function to remove the legend when the component unmounts
      return () => {
        map.removeControl(legend);
      };
    }
  }, [map, grades, colors, title]); // Re-run effect if map or data changes

  return null; // The component doesn't render anything itself, it just adds a Leaflet control
};

export default Legend;