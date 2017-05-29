attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 modelMatrix;
uniform float time;

varying vec3 vPosition;
varying vec3 vNormal;

#pragma glslify: computeTranslateMat = require(glsl-matrix/computeTranslateMat);
#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);

void main(void) {
  mat4 translateMat = computeTranslateMat(vec3(0.0, 0.0, 0.0));
  mat4 rotateMat = computeRotateMat(radians(-90.0), 0.0, 0.0);
  vec4 updatePosition = translateMat * rotateMat * vec4(position, 1.0);
  vPosition = (modelMatrix * updatePosition).xyz;
  vNormal = (rotateMat * vec4(normal, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
