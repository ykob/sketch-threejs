attribute vec3 position;
attribute vec2 uv;
attribute vec3 instancePosition;
attribute float delay;
attribute float h;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying float vDelay;
varying vec3 vColor;

#pragma glslify: computeRotateMat = require(glsl-matrix/computeRotateMat);
#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main(void) {
  // calculate posiitons of instances.
  vec3 updatePosition = position + instancePosition;
  mat4 rotateMat = computeRotateMat(radians(90.0), 0.0, radians(180.0));
  vec4 mvPosition = modelViewMatrix * rotateMat * vec4(updatePosition, 1.0);

  // calculate interval for uv animation and setting color.
  vec3 hsv = vec3(h + time * 0.1, 0.35, 0.6);
  vec3 rgb = convertHsvToRgb(hsv);

  vPosition = position;
  vUv = uv;
  vDelay = delay;
  vColor = rgb;

  gl_Position = projectionMatrix * mvPosition;
}
