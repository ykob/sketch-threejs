attribute vec3 position;
attribute vec2 uv;
attribute vec3 iPosition;
attribute float iDelay;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: calcTranslateMat4 = require(glsl-matrix/calcTranslateMat4);

const float duration = 8.0;

void main(void) {
  // Loop animation
  float interval = mod(time + iDelay, duration) / duration;
  vec3 move = vec3(0.0, 0.0, (interval * 2.0 - 1.0) * 100.0);

  // coordinate transformation
  mat4 translateMat = calcTranslateMat4(iPosition);
  vec4 mvPosition = modelViewMatrix * translateMat * vec4(position + move, 1.0);

  vPosition = position;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
