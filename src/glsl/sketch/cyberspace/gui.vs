attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying vec3 vColor;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main(void) {
  // calculate color
  vec3 hsv = vec3(time * 0.1 + 0.1, 0.1, 1.0);
  vec3 rgb = convertHsvToRgb(hsv);

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  vPosition = position;
  vUv = uv;
  vColor = rgb;

  gl_Position = projectionMatrix * mvPosition;
}
