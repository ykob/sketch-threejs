attribute vec3 position;
attribute vec3 normal;
attribute float height;
attribute float offsetX;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;

varying vec3 vPosition;
varying mat4 vInvertMatrix;

#pragma glslify: computeTranslateMat = require(glsl-matrix/computeTranslateMat);
#pragma glslify: computeScaleMat = require(glsl-matrix/computeScaleMat);
#pragma glslify: inverse = require(glsl-inverse);

void main(void) {
  mat4 translateMat = computeTranslateMat(vec3(offsetX, 0.0, 0.0));
  mat4 scaleMat = computeScaleMat(vec3(1.0, (position.y + 0.5) * height, 1.0));
  vec4 updatePosition = scaleMat * translateMat * vec4(position, 1.0);
  vPosition = (modelMatrix * updatePosition).xyz;
  vInvertMatrix = inverse(modelMatrix);
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
