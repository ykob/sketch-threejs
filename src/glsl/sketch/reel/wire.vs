attribute vec3 position;
attribute vec3 normal;
attribute float radian;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
uniform float rotate;

varying vec3 vPosition;
varying vec3 vNormal;
varying mat4 vInvertMatrix;

#pragma glslify: inverse = require(glsl-inverse);
#pragma glslify: computeTranslateMat = require(glsl-matrix/computeTranslateMat);
#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);

void main(void) {
  mat4 rotateMatWorld = computeRotateMat(0.0, radian + radians(rotate), 0.0);
  mat4 translateMat = computeTranslateMat(vec3(1000.0, 0.0, 0.0));
  vec4 updatePosition = rotateMatWorld * translateMat * vec4(position, 1.0);
  vPosition = updatePosition.xyz;
  vInvertMatrix = inverse(rotateMatWorld * translateMat);
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
