attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
uniform float timeShow;
uniform float durationShow;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);
#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);

varying vec3 vPosition;
varying vec3 vColor;

void main() {
  vec2 resolution = uv * 2.0 - 1.0;
  float rotateX = resolution.x * 100.0 + time / 2.0;
  float rotateY = resolution.y * 200.0 + time / 2.0;
  float rotateZ = length(resolution.xy) * 150.0 + time / 2.0;
  mat4 rotateMat = computeRotateMat(rotateX, rotateY, rotateZ);
  vec3 rotatePosition = (rotateMat * vec4(vec3(sin(time * 0.1 + resolution.x * 10.0) * 200.0), 1.0)).xyz;
  vec3 wavePosition = vec3(0.0, 0.0, sin(time * 0.1 + (resolution.x + resolution.y) * 2.4) * 500.0);
  vec3 updatePosition = position + rotatePosition + wavePosition;

  vec3 hsv = vec3(time * 0.1, 0.35, 0.6);
  vec3 rgb = convertHsvToRgb(hsv);

  vec4 mvPosition = modelViewMatrix * vec4(updatePosition, 1.0);

  vPosition = updatePosition;
  vColor = rgb;

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 4.0 * (pow(sin(rotateX * 10.0), 3.0) + 1.0) / 2.0 + 3.0;
}
