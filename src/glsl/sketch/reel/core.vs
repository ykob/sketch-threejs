attribute vec3 position;
attribute float radian;
attribute vec3 hsv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
uniform float rotate;

varying vec4 vPosition;
varying vec3 vColor;

#pragma glslify: computeTranslateMat = require(glsl-matrix/computeTranslateMat);
#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main(void) {
  mat4 rotateMatWorld = computeRotateMat(0.0, radian + radians(rotate), 0.0);
  vec4 updatePosition = rotateMatWorld * computeTranslateMat(vec3(1000.0, 0.0, 0.0)) * vec4(position, 1.0);
  vPosition = updatePosition;
  vColor = convertHsvToRgb(hsv);
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
