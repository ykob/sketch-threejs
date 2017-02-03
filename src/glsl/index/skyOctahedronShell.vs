attribute vec3 position;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

varying vec3 vPosition;
varying float vOpacity;

const float duration = 8.0;
const float delay = 3.0;

#pragma glslify: ease = require(glsl-easings/exponential-out)
#pragma glslify: computeScaleMat = require(glsl-matrix/computeScaleMat);
#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);

void main() {
  float now = ease(clamp((time - delay) / duration, 0.0, 1.0));
  mat4 scaleMat = computeScaleMat(vec3(now * 0.6 + 0.4 + sin(time) * 0.1));
  mat4 rotateMat = computeRotateMat(radians(45.0), radians(time * 2.0), radians(-time * 2.0));
  vec4 updatePosition = rotateMat * scaleMat * vec4(position, 1.0);
  vPosition = normalize(position);
  vOpacity = normalize(updatePosition).z;
  gl_Position = projectionMatrix * modelViewMatrix * updatePosition;
}
