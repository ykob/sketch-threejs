attribute vec3 position;

uniform vec3 cameraPosition;
uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform float time;

varying vec3 vColor;
varying float vOpacity;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  float noise1 = snoise3(mvPosition.xyz * 0.046 + vec3(-time, time, time) * 0.3);
  float noise2 = snoise3(mvPosition.xyz * 0.0012 + vec3(time, -time, time) * 0.01);

  vec3 hsv = vec3(noise2 * 0.2 + time * 0.1, 1.0, 0.6);
  vec3 rgb = convertHsvToRgb(hsv);

  vColor = rgb;
  vOpacity = pow(40.0 / length(mvPosition.xyz) * noise1, 2.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 600.0 / length(mvPosition.xyz) * noise1;
}
