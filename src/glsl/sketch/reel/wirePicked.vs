attribute vec3 position;
attribute float radian;
attribute vec3 pickedColor;
attribute float timeHover;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
uniform float rotate;

varying vec3 vColor;

#pragma glslify: ease = require(glsl-easings/circular-out)
#pragma glslify: computeTranslateMat = require(glsl-matrix/computeTranslateMat);
#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);
#pragma glslify: computeScaleMat = require(glsl-matrix/computeScaleMat);

void main(void) {
  float easeStep = ease(timeHover / 0.3);
  mat4 rotateMatWorld = computeRotateMat(0.0, radian + radians(rotate), 0.0);
  mat4 scaleMat = computeScaleMat(vec3(1.0 + easeStep * 0.2));
  mat4 translateMat = computeTranslateMat(vec3(1000.0, 0.0, 0.0));
  vec4 updatePosition = rotateMatWorld * translateMat * scaleMat * vec4(position, 1.0);
  vColor = pickedColor;
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
