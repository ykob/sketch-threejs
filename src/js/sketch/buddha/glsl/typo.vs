attribute vec3 position;
attribute vec2 uv;
attribute vec3 iPosition;
attribute vec2 iUv;
attribute float iId;
attribute float iTime;
attribute float iIsAnimated;
attribute float iScale;
attribute float iMove;

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

#pragma glslify: calcScaleMat4 = require(@ykob/glsl-util/src/calcScaleMat4);
#pragma glslify: calcRotateMat4 = require(@ykob/glsl-util/src/calcRotateMat4);

void main(void) {
  vec3 move = vec3(0.0, iTime / duration * iMove, 0.0);
  mat4 scaleMat = calcScaleMat4(vec3(iScale));
  mat4 rotateMat = calcRotateMat4(vec3(
    radians(sin(time * 0.3 + iId * 30.0) * 30.0),
    radians(cos(time * 0.3 + iId * 30.0) * 45.0),
    radians(cos(time * 0.3 + iId * 30.0) * 30.0)
  ));
  vec3 updatePosition = (rotateMat * scaleMat * vec4(position, 1.0)).xyz;

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(iPosition + move + updatePosition, 1.0);

  vPositionNoise = position + iId;
  vUv = uv * unitUv + iUv;
  vUvBase = uv;
  vOpacity = iIsAnimated;
  vStep = iTime / duration;

  gl_Position = projectionMatrix * mvPosition;
}
