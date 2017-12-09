attribute vec3 position;
attribute vec2 uv;
attribute vec3 instancePosition;
attribute float rotate;
attribute float delay;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec2 vUv;

#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);

void main(void) {
  vec3 updatePosition = position + instancePosition;
  mat4 rotateMat = computeRotateMat(radians(90.0), 0.0, radians(rotate));
  vec4 mvPosition = modelViewMatrix * rotateMat * vec4(updatePosition, 1.0);

  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
