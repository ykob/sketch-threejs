attribute vec3 position;
attribute vec2 uv;
attribute vec3 iPosition;
attribute vec3 iDirection;
attribute float iTime;
attribute float iDuration;
attribute float iDistance;
attribute float iScale;
attribute vec3 iRotate;
attribute vec2 iUvDiff;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;

varying vec2 vUv;
varying vec2 vUvDiff;
varying float vOpacity;
varying float vStep;

#pragma glslify: calcRotateMat4 = require(glsl-matrix/calcRotateMat4);
#pragma glslify: calcScaleMat4 = require(glsl-matrix/calcScaleMat4);

void main(void) {
  float stp = iTime / iDuration;

  mat4 rotateMat = calcRotateMat4(iRotate * time * 2.0);
  mat4 scaleMat = calcScaleMat4(vec3(iScale));
  vec3 transformed = position + vec3(cos(time * 3.0) * 6.0 * stp, 0.0, sin(time * 3.0) * 6.0 * stp);
  transformed = (rotateMat * scaleMat * vec4(transformed, 1.0)).xyz;
  transformed = transformed + iPosition + iDirection * iDistance * stp;
  vec4 mPosition = modelMatrix * vec4(transformed, 1.0);

  vUv = uv;
  vUvDiff = iUvDiff;
  vOpacity = step(0.0, iTime);
  vStep = stp;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
