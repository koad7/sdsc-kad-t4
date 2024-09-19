// import * as pmtiles from "pmtiles";
// import * as maplibregl from "maplibre-gl";
// import layers from "protomaps-themes-base";
// import "@mapbox/vector-tile";

// FAINAL - with request to workers

// const map = new maplibregl.Map({
//   container: 'map',
//   style:
//       'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
//   center: [31.4606, 20.7927],
//   zoom: 0.5
// });
// const dataFetcher = new Worker(new URL('./workers/dataFetcher.js', import.meta.url));

// const daySlider = document.getElementById('daySlider');
// const monthSlider = document.getElementById('monthSlider');
// const yearLabel = document.getElementById('year'); 

// const months = [
//   'January', 'February', 'March', 'April', 'May', 'June',
//   'July', 'August', 'September', 'October', 'November', 'December'
// ];

// let currentYear = 2023;
// let currentMonth = 0;
// let currentDay = 1;

// monthSlider.addEventListener('input', () => {
//   currentMonth = parseInt(monthSlider.value, 10);
//   yearLabel.textContent = currentYear;
//   downloadGeoJSONBasedOnZoomBBoxAndTime(currentDay, currentMonth, currentYear);
// });

// daySlider.addEventListener('input', () => {
//   currentDay = parseInt(daySlider.value, 10);
//   downloadGeoJSONBasedOnZoomBBoxAndTime(currentDay, currentMonth, currentYear);
// });

// function calculatePipelines(zoomLevel) {
//   if (zoomLevel < 5) return 1;  
//   if (zoomLevel >= 5 && zoomLevel < 10) return 4;  
//   if (zoomLevel >= 10 && zoomLevel <= 14) return 8;  
// }

// function splitBoundingBox(bbox, numberOfPipelines) {
//   const latRange = bbox.northEast.lat - bbox.southWest.lat;
//   const lngRange = bbox.northEast.lng - bbox.southWest.lng;
  
//   const latIncrement = latRange / Math.sqrt(numberOfPipelines);
//   const lngIncrement = lngRange / Math.sqrt(numberOfPipelines);
  
//   let subBboxes = [];
  
//   for (let i = 0; i < Math.sqrt(numberOfPipelines); i++) {
//     for (let j = 0; j < Math.sqrt(numberOfPipelines); j++) {
//       subBboxes.push({
//         northEast: {
//           lat: bbox.northEast.lat - i * latIncrement,
//           lng: bbox.northEast.lng - j * lngIncrement,
//         },
//         southWest: {
//           lat: bbox.northEast.lat - (i + 1) * latIncrement,
//           lng: bbox.northEast.lng - (j + 1) * lngIncrement,
//         },
//       });
//     }
//   }
  
//   return subBboxes;
// }

// function downloadGeoJSONBasedOnZoomBBoxAndTime(day, month, year) {
//   const bounds = map.getBounds();   
//   const zoomLevel = Math.floor(map.getZoom());   

//   const bbox = {
//     northEast: bounds.getNorthEast(),
//     southWest: bounds.getSouthWest(),
//   };

//   const numberOfPipelines = calculatePipelines(zoomLevel);

//   const subBboxes = splitBoundingBox(bbox, numberOfPipelines);

//   const promises = subBboxes.map(subBbox => {
//     return new Promise((resolve, reject) => {
//       dataFetcher.postMessage({
//         zoomLevel: zoomLevel,
//         bbox: subBbox,
//         day: day,
//         month: month,
//         year: year
//       });

//       dataFetcher.onmessage = (event) => {
//         const { data, zoomLevel } = event.data;
//         resolve({ data, zoomLevel });
//       };

//       dataFetcher.onerror = (error) => {
//         reject(error);
//       };
//     });
//   });

//   Promise.all(promises)
//     .then(results => {
//       results.forEach(result => {
//         const { data, zoomLevel } = result;
//         const sourceId = `geojson-${zoomLevel}`;

//         if (map.getSource(sourceId)) {
//           map.getSource(sourceId).setData(data);
//         } else {
//           map.addSource(sourceId, { 'type': 'geojson', 'data': data });

//           map.addLayer({
//             'id': `layer-${zoomLevel}`,
//             'type': 'circle',
//             'source': sourceId,
//             'paint': {
//               'circle-color': '#FCA107',
//               'circle-radius': 8,
//             },
//           });
//         }
//       });
//     })
//     .catch(error => {
//       console.error('Error processing pipelines: ', error);
//     });
// }

// map.on('zoomend', () => downloadGeoJSONBasedOnZoomBBoxAndTime(currentDay, currentMonth, currentYear));
// map.on('moveend', () => downloadGeoJSONBasedOnZoomBBoxAndTime(currentDay, currentMonth, currentYear));


import * as pmtiles from "pmtiles";
import * as maplibregl from "maplibre-gl";
import layers from "protomaps-themes-base";
import "@mapbox/vector-tile";
// add the PMTiles plugin to the maplibregl global.
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

const PMTILES_URL = 'https://pmtiles.io/protomaps(vector)ODbL_firenze.pmtiles';

const p = new pmtiles.PMTiles(PMTILES_URL);

// this is so we share one instance across the JS code and the map renderer
protocol.add(p);

// we first fetch the header so we can get the center lon, lat of the map.
p.getHeader().then(h => {
    const map = new maplibregl.Map({
        container: 'map',
        zoom: h.maxZoom - 2,
        center: [h.centerLon, h.centerLat],
        style: {
            version: 8,
            sources: {
                'example_source': {
                    type: 'vector',
                    url: `pmtiles://${PMTILES_URL}`,
                    attribution: '© <a href="https://openstreetmap.org">OpenStreetMap</a>'
                }
            },
            layers: [
                {
                    'id': 'buildings',
                    'source': 'example_source',
                    'source-layer': 'landuse',
                    'type': 'fill',
                    'paint': {
                        'fill-color': 'steelblue'
                    }
                },
                {
                    'id': 'roads',
                    'source': 'example_source',
                    'source-layer': 'roads',
                    'type': 'line',
                    'paint': {
                        'line-color': 'black'
                    }
                },
                {
                    'id': 'mask',
                    'source': 'example_source',
                    'source-layer': 'mask',
                    'type': 'fill',
                    'paint': {
                        'fill-color': 'white'
                    }
                }
            ]
        }
    });
});
// Protocol.register(map);
// req = {
//   "variables": ["eddy_kinetic_energy", "10m_v_component_of_wind"],
//   "time_range": ["2020-01-01", "2021-01-01"],
//   "bbox": [-180, -90, 180, 90]
// }

// function addPMTilesSource(variable) {
//   const pmtilesUrl = `/get_pmtiles/${variable}`;

//   const source = new PMTiles(pmtilesUrl);

//   map.addSource(variable, {
//     type: 'vector',
//     url: `pmtiles://${pmtilesUrl}`,
//   });

//   // Add a layer to display the data
//   map.addLayer({
//     id: `${variable}-layer`,
//     type: 'fill',
//     source: variable,
//     'source-layer': variable, // Layer name from Tippecanoe
//     paint: {
//       'fill-color': '#888',
//       'fill-opacity': 0.5,
//     },
//   });
// }

// addPMTilesSource('eddy_kinetic_energy');
