attribute vec3 position;
attribute vec3 instancePosition;
attribute vec3 instanceRotate;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: calcTranslateMat4 = require(glsl-matrix/calcTranslateMat4);
#pragma glslify: calcRotateMat4 = require(glsl-matrix/calcRotateMat4);

void main(void) {
  // coordinate transformation
  mat4 translateMat = calcTranslateMat4(instancePosition);
  mat4 rotateMat = calcRotateMat4(instanceRotate);
  vec4 mvPosition = modelViewMatrix * translateMat * rotateMat * vec4(position, 1.0);

  vPosition = mvPosition.xyz;
  vUv = uv;

  gl_Position = projectionMatrix * mvPosition;
}
