attribute vec3 position;
attribute vec3 normal;
attribute vec3 faceNormal;
attribute vec3 center;
attribute float delay;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

varying vec3 vPosition;
varying float vNoise;
varying float vNow;

const float duration = 2.0;
const float delayAll = 1.0;

#pragma glslify: ease = require(glsl-easings/exponential-out)
#pragma glslify: computeTranslateMat = require(glsl-matrix/computeTranslateMat);
#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

void main() {
  float now = ease(max((time - delayAll - delay - (faceNormal.x + 1.0) / 2.0 - (faceNormal.y + 1.0) / 2.0) / duration, 0.0));
  mat4 translateMat = computeTranslateMat(vec3(faceNormal) * 1200.0 * (1.0 - now) + vec3(0.0, sin(time) * 10.0 + 210.0, 0.0));
  mat4 rotateMat = computeRotateMat(0.0, radians((1.0 - now) * faceNormal.y * 4320.0), 0.0);
  float rotateRadian = radians((time + faceNormal.x + faceNormal.y) * 1440.0);
  mat4 rotateMatSelf = computeRotateMat(rotateRadian, rotateRadian, 0.0);
  float noise = smoothstep(-0.4, 0.4,
    cnoise3(vec3(position.x * 0.035 - time, position.y * 0.035 - time, position.z * 0.035 + time))
  ) * 2.0 - 1.0;
  vec3 updatePositionSelf = (rotateMatSelf * vec4(position - center, 1.0)).xyz * (1.0 - now) + position
    + normalize(position) * noise ;
  vec4 updatePosition = rotateMat * translateMat * vec4(updatePositionSelf, 1.0);
  vPosition = updatePosition.xyz;
  vNoise = noise;
  vNow = now;
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
