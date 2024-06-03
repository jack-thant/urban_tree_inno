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
    minZoom?: number, // Minimum zoom level
    maxZoom?: number, // Maximum zoom level
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

// export const heatMapColorRange: Array<string> = ["#3F7FFF", "#5C9CFF", "#79B6FF", "#FF0000", "#B03060", "#C62828"]

export const heatMapColorRange: Array<string> = ["#ffffb2", "#fed976", "#feb24c", "#fd8d3c", "#f03b20", "#bd0026"]

export const heatMapNumberLegend: Array<number> = [19,38]

export const heatMapLegendTitle: string = "Temperature Legend (°C)"
