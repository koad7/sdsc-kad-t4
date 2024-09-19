self.onmessage = (event) => {
    const { type, zoomLevel, bbox, month } = event.data;  // Receiving month (slider value)
    console.log(`Worker:${zoomLevel}/${bbox.southWest.lng},${bbox.southWest.lat},${bbox.northEast.lng},${bbox.northEast.lat}`);
    if (type === 'loadGeoJSONForBBoxZoomAndMonth') {
      const geojsonFileUrl = 'http://localhost:5173/data.geojson'//`https://example.com/geojson/${zoomLevel}/${bbox.southWest.lng},${bbox.southWest.lat},${bbox.northEast.lng},${bbox.northEast.lat}.geojson`;
  
      fetch(geojsonFileUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error fetching GeoJSON for BBOX ${bbox.southWest} - ${bbox.northEast} at zoom level ${zoomLevel}`);
          }
          return response.json();
        })
        .then(data => {
          const filteredFeatures = data.features.filter(feature => {
            const featureMonth = new Date(feature.properties.time).getMonth();  // Assuming 'time' property exists
            return featureMonth === month;  // Filter features based on the selected month
          });
  
          self.postMessage({ type: 'geojsonData', data: { ...data, features: filteredFeatures }, zoomLevel });
        })
        .catch(error => {
          self.postMessage({ type: 'error', error: error.message });
        });
    }
  };
  