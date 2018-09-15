attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vColor1;
varying vec3 vColor2;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

const float duration = 3.0;

void main() {
  // calculate colors
  vec3 hsv1 = vec3(time * 0.1, 0.6, 1.0);
  vec3 rgb1 = convertHsvToRgb(hsv1);
  vec3 hsv2 = vec3(time * 0.1 + 0.2, 0.6, 1.0);
  vec3 rgb2 = convertHsvToRgb(hsv2);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  vColor1 = rgb1;
  vColor2 = rgb2;

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 7.0;
}
