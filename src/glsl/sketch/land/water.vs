attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: calcTranslateMat4 = require(glsl-matrix/calcTranslateMat4);

void main(void) {
  float sin1 = sin(time / 2.0 + position.x / 100.0) * 4.0;
  float sin2 = sin(time / 2.0 + position.y / 50.0) * 3.0;
  float sin3 = sin(time / 2.0 + (position.x + position.y / 2.0) / 80.0) * 2.0;
  mat4 waveMat = calcTranslateMat4(vec3(0.0, 0.0, sin1 + sin2 + sin3));

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * waveMat * vec4(position, 1.0);

  vPosition = mvPosition.xyz;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
