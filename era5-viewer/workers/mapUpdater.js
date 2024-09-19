self.onmessage = (event) => {
  const { processedData, zoomLevel } = event.data;

  self.postMessage({ type: 'mapData', processedData, zoomLevel });
};
