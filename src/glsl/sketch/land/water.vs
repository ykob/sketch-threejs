attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: calcTranslateMat4 = require(glsl-matrix/calcTranslateMat4);

void main(void) {
  float sin1 = sin(time + position.x / 50.0) * 2.0;
  float sin2 = sin(time + position.y / 20.0) * 1.0;
  float sin3 = sin(time + (position.x + position.y / 2.0) / 30.0) * 0.5;
  mat4 waveMat = calcTranslateMat4(vec3(0.0, 0.0, sin1 + sin2 + sin3));

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * waveMat * vec4(position, 1.0);

  vPosition = mvPosition.xyz;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
