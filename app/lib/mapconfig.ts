import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import { INITIAL_VIEW_STATE_FRAME, Material } from "./definitions";

export const sg_latitude: number = 1.3521;
export const sg_longitude: number = 103.8198;

// Define the AmbientLight with white color and full intensity
export const ambientLight = new AmbientLight({
  color: [255, 255, 255], // RGB color
  intensity: 1.0, // Intensity of the light
});

// Define the first PointLight with white color, intensity, and position
export const pointLight1 = new PointLight({
  color: [255, 255, 255], // RGB color
  intensity: 0.8, // Intensity of the light
  position: [-0.144528, 49.739968, 80000], // [longitude, latitude, altitude]
});

// Define the second PointLight with white color, intensity, and position
export const pointLight2 = new PointLight({
  color: [255, 255, 255], // RGB color
  intensity: 0.8, // Intensity of the light
  position: [-3.807751, 54.104682, 8000], // [longitude, latitude, altitude]
});

// Create a LightingEffect with the defined lights
export const lightingEffect = new LightingEffect({
  ambientLight, // Ambient light
  pointLight1,  // First point light
  pointLight2,  // Second point light
});

// Define the material properties for lighting calculations
export const material: Material = {
  ambient: 0.64, // Ambient reflection coefficient
  diffuse: 0.6, // Diffuse reflection coefficient
  shininess: 32, // Shininess for specular reflection
  specularColor: [51, 51, 51], // Specular color in RGB
};

// Define the initial view state for the map
export const INITIAL_VIEW_STATE: INITIAL_VIEW_STATE_FRAME = {
  longitude: sg_longitude, // Center longitude
  latitude: sg_latitude, // Center latitude
  zoom: 11, // Initial zoom level
  minZoom: 10, // Minimum zoom level
  maxZoom: 20, // Maximum zoom level
  pitch: 0, // Camera pitch (tilt) in degrees
  bearing: 0, // Camera bearing (rotation) in degrees
};

// Define the color range for the visual representation
export const colorRange: [number, number, number][] = [
  [1, 152, 189],   // RGB color
  [73, 227, 206],  // RGB color
  [216, 254, 181], // RGB color
  [254, 237, 177], // RGB color
  [254, 173, 84],  // RGB color
  [209, 55, 78],   // RGB color
];