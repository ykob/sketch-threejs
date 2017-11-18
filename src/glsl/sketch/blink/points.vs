attribute vec3 position;

uniform vec3 cameraPosition;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform float time;

varying vec3 vColor;
varying float vOpacity;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  float noise1 = snoise3(position * 0.024 + vec3(-time, time, time) * 0.3);
  float noise2 = snoise3(position * 0.001 + vec3(time, -time, time) * 0.01);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  vec3 hsv = vec3(noise2 + time * 0.1, 0.6, 1.0);
  vec3 rgb = convertHsvToRgb(hsv);

  vColor = rgb;
  vOpacity = max(noise1 * (length(cameraPosition) / length(mvPosition.xyz)), 0.0);

  gl_PointSize = length(cameraPosition) / length(mvPosition.xyz) * 4.0 * noise1;
  gl_Position = projectionMatrix * mvPosition;
}
