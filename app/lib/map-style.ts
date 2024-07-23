import type { GeoJSONSourceRaw, FillLayer, LineLayer } from 'react-map-gl';

import MAP_STYLE from '../../map-style-basic-v8.json';

const sgDistricts: GeoJSONSourceRaw = {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/jack-thant/urban_tree_inno/main/public/sgDistricts.geojson'
}

const fillLayer: FillLayer = {
    id: 'sg-districts-fill',
    source: 'sg-districts',
    type: 'fill',
    paint: {
        'fill-outline-color': '#0040c8',
        'fill-color': '#fff',
        'fill-opacity': 0
    }
};

const lineLayer: LineLayer = {
    id: 'sg-districts-outline',
    source: 'sg-districts',
    type: 'line',
    paint: {
        'line-width': 2,
        'line-color': '#64748b'
    }
};

// Hightlighted district polygons
export const highlightLayer: FillLayer = {
    id: 'sg-districts-hightlighted',
    type: 'fill',
    source: 'sg-districts',
    paint: {
        'fill-outline-color': '#99f6e4',
        'fill-color': '#14b8a6',
        'fill-opacity': 0.75
    }
}

const SGMapStyle = {
    ...MAP_STYLE,
    sources: {
        ...MAP_STYLE.sources,
        ['sg-districts']: sgDistricts
    },
    layers: [...MAP_STYLE.layers, fillLayer, lineLayer]
}

// Make a copy of the Map style
export default SGMapStyle;
