attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 3.0;
}
