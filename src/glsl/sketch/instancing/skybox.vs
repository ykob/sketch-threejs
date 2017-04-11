attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;

#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);

void main(void) {
  mat4 rotateMat = computeRotateMat(sin(time) * 0.2, time, 0.0);
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * rotateMat * vec4(position, 1.0);
}
