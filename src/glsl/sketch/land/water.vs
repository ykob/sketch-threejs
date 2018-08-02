attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying float vSinAll;

#pragma glslify: calcTranslateMat4 = require(glsl-matrix/calcTranslateMat4);

void main(void) {
  float sin1 = sin(time + position.x / 16.0);
  float sin2 = sin(time + position.y / 8.0);
  float sin3 = sin(time + (position.x + position.y / 4.0) / 2.0);
  float sinAll = (sin1 + sin2 * 0.5 + sin3 * 0.2) / 1.7;
  mat4 waveMat = calcTranslateMat4(vec3(0.0, 0.0, sinAll));

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * waveMat * vec4(position, 1.0);

  vPosition = mvPosition.xyz;
  vUv = uv;
  vSinAll = sinAll;

  gl_Position = projectionMatrix * mvPosition;
}
