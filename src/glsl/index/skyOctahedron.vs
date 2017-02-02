attribute vec3 position;
attribute vec3 normal;
attribute vec3 faceNormal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;

varying vec3 vPosition;
varying float vNow;

const float duration = 1.0;
const float delay = 2.0;

#pragma glslify: ease = require(glsl-easings/exponential-out)

void main() {
  float now = clamp((time - delay - normalize(faceNormal).x * 0.5 - normalize(faceNormal).y * 0.5) / duration, 0.0, 1.0);
  float translate = (1.0 - ease(now)) * 2048.0;
  vec3 updatePosition = position + vec3(faceNormal.x, faceNormal.y * 0.4, faceNormal.z) * translate;
  vPosition = position;
  vNow = now;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(updatePosition, 1.0);
}
