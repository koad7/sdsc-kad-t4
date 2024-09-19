// FINAL - with request from the main thread
// self.onmessage = (event) => {
//     const { zoomLevel, bbox, day, month, year } = event.data;
  
//     const zoomCoordX = Math.floor(bbox.southWest.lng);   
//     const zoomCoordY = Math.floor(bbox.southWest.lat);  
  
//     const geojsonFilePath = `/zoom_${zoomLevel}_${zoomCoordX}_${zoomCoordY}.geojson`;
  
//     fetch(geojsonFilePath)
//       .then(response => response.json())
//       .then(rawData => {
//         const dataProcessor = new Worker('./dataProcessor.js');
//         dataProcessor.postMessage({ rawData, zoomLevel, bbox, day, month, year });
  
//         dataProcessor.onmessage = (e) => {
//           const processedData = e.data;
  
//           const mapUpdater = new Worker('./mapUpdater.js');
//           mapUpdater.postMessage({ processedData });
//         };
//       })
//       .catch(error => {
//         self.postMessage({ error: `Data fetching error: ${error.message}` });
//       });
//   };
  
// self.onmessage = async function(event) {
//     const variable = event.data.variable;
  
//     try {
//       const response = await fetch(`/get_pmtiles/${variable}`);
//       if (!response.ok) {
//         throw new Error(`Error fetching PMTiles: ${response.statusText}`);
//       }
  
//       // Read the response as an ArrayBuffer
//       const pmtilesArrayBuffer = await response.arrayBuffer();
  
//       // Post the data to dataProcessor
//       self.postMessage({ pmtilesArrayBuffer }, [pmtilesArrayBuffer]); // Transferable
//     } catch (error) {
//       console.error(error);
//       self.postMessage({ error: error.message });
//     }
//   };
  