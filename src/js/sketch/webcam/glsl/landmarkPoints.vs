attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vColor;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

const float duration = 3.0;

void main() {
  // calculate colors
  vec3 hsv = vec3(0.45 + time * 0.1, 0.6, 1.0);
  vec3 rgb = convertHsvToRgb(hsv);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  vColor = rgb;

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 7.0;
}
