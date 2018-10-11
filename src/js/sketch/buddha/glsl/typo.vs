attribute vec3 position;
attribute vec2 uv;
attribute vec3 iPosition;
attribute vec2 iUv;
attribute float iId;
attribute float iTime;
attribute float iIsAnimated;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
uniform float unitUv;
uniform float duration;

varying vec3 vPositionNoise;
varying vec2 vUv;
varying vec2 vUvBase;
varying float vOpacity;
varying float vStep;

#pragma glslify: calcRotateMat4 = require(glsl-matrix/calcRotateMat4);

void main(void) {
  vec3 move = vec3(0.0, iTime / duration * 35.0, 0.0);
  mat4 rotateMat = calcRotateMat4(vec3(
    radians(sin(time + iId * 30.0) * 30.0),
    radians(cos(time + iId * 30.0) * 45.0),
    radians(cos(time + iId * 30.0) * 30.0)
  ));
  vec3 rotatePosition = (rotateMat * vec4(position, 1.0)).xyz;

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(iPosition + move + rotatePosition, 1.0);

  vPositionNoise = position + iId;
  vUv = uv * unitUv + iUv;
  vUvBase = uv;
  vOpacity = iIsAnimated;
  vStep = iTime / duration;

  gl_Position = projectionMatrix * mvPosition;
}
