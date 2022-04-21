precision highp float;

uniform float time;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  vec3 hsv = vec3(0.5 + time * 0.1, 0.4, 1.0);
  vec3 rgb = convertHsvToRgb(hsv);
  gl_FragColor = vec4(rgb, 0.25);
}
