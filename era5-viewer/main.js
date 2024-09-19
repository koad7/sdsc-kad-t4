import * as pmtiles from "pmtiles";
import * as maplibregl from "maplibre-gl";
import layers from "protomaps-themes-base";
import "@mapbox/vector-tile";
const dataFetcherWorker = new Worker('./workers/dataFetcher.js');

function sendZoomAndBBoxToWorker(zoom, zoomMax, zoomMin, bbox) {
    const payload = {
        zoom: zoom,
        zoomMax: zoomMax,
        zoomMin: zoomMin,
        bbox: bbox
    };
    console.log("Current Zoom Level:", zoom);
    console.log("Current Bounding Box:",bbox );  
    dataFetcherWorker.postMessage(JSON.stringify(payload)); 
}

    
const protocol = new pmtiles.Protocol();
maplibregl.addProtocol('pmtiles', protocol.tile);

const PMTILES_URL = 'https://pmtiles.io/protomaps(vector)ODbL_firenze.pmtiles';

const p = new pmtiles.PMTiles(PMTILES_URL);
protocol.add(p);

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

    

    map.on('load', 
        const zoom = Math.round(map.getZoom()),  
        const bbox = map.getBounds().toArray(),   

        const zoomMax = map.getMaxZoom(),
        const zoomMin = map.getMinZoom(),         

        sendZoomAndBBoxToWorker(zoom, zoomMax, zoomMin, bbox));

    map.on('zoomend', sendZoomAndBBoxToWorker(zoom, zoomMax, zoomMin, bbox));   
    map.on('moveend', sendZoomAndBBoxToWorker(zoom, zoomMax, zoomMin, bbox));   
});

