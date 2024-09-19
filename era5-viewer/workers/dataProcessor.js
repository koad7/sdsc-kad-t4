self.onmessage = (event) => {
    const { rawData, zoomLevel, month } = event.data;
  
    const processedData = {
      ...rawData,
      features: rawData.features.filter(feature => {
        const featureMonth = new Date(feature.properties.time).getMonth();  // Assuming 'time' exists
        return featureMonth === month;
      }),
    };
  
    self.postMessage({ processedData, zoomLevel });
  };
  