attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

varying vec3 vColor;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main(void) {
  vec2 p = uv * 2.0 - 1.0;
  // calculate gradation
  vec3 hsv = vec3(0.13, 0.8, p.y * 0.8 + 0.04);
  vec3 rgb = convertHsvToRgb(hsv);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  vColor = rgb;

  gl_Position = projectionMatrix * mvPosition;
}
