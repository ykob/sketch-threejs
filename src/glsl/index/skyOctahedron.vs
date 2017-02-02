attribute vec3 position;
attribute vec3 normal;
attribute vec3 faceNormal;
attribute vec3 center;
attribute float delay;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

varying vec3 vPosition;
varying float vNow;

const float duration = 2.0;
const float delayAll = 1.0;

#pragma glslify: ease = require(glsl-easings/exponential-out)
#pragma glslify: computeTranslateMat = require(glsl-matrix/computeTranslateMat);
#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);

void main() {
  float now = ease(max((time - delayAll - delay - (faceNormal.x + 1.0) / 2.0 - (faceNormal.y + 1.0) / 2.0) / duration, 0.0));
  mat4 translateMat = computeTranslateMat(vec3(faceNormal.x, faceNormal.y * 0.5, faceNormal.z) * 12000.0 * (1.0 - now));
  mat4 rotateMat = computeRotateMat(0.0, radians((1.0 - now) * faceNormal.y * 4320.0), 0.0);
  float rotateRadian = radians((time + delay * 100.0) * -360.0);
  mat4 rotateMatSelf = computeRotateMat(rotateRadian, rotateRadian, rotateRadian);
  vec4 updatePosition = rotateMat * translateMat * vec4((rotateMatSelf * vec4(position - center, 1.0)).xyz * (1.0 - pow(now, 3.0)) + position, 1.0);
  vPosition = updatePosition.xyz;
  vNow = now;
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
