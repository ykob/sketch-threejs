precision highp float;

uniform float time;

varying vec3 vPosition;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  // calculate colors
  vec3 hsv = vec3(time * 0.1 + 0.5, 1.0, (1.0 - abs(vPosition.y / 10000.0)) * 0.08);
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, 1.0);
}
