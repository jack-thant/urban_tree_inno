export type Material = {
    ambient: number,
    diffuse: number,
    shininess: number,
    specularColor: number[]
};

export type INITIAL_VIEW_STATE_FRAME = {
    longitude: number, // Center longitude
    latitude: number, // Center latitude
    zoom: number, // Initial zoom level
    minZoom: number, // Minimum zoom level
    maxZoom: number, // Maximum zoom level
    pitch: number, // Camera pitch (tilt) in degrees
    bearing: number, // Camera bearing (rotation) in degrees
}

export interface InterpolatedTempRecord {
    lat: number,
    lon: number,
    "Mean Temperature": number
}

export type MarkerPosition = {
    position: [longitude: number, latitude: number];
}

export type ImpactAssessment = {
    message: string,
    planted_trees: number,
    totalNumberOfTrees: Array<number>,
    annualEnergySaved: number,
    annualCarbonSequestration: number,
    airPollutantsRemoved: number,
    stormWaterRunOffReduction: number,
    averageTemperatureReduction: number
}

export type TreePosition = {
    lat: number,
    lon: number
}
  