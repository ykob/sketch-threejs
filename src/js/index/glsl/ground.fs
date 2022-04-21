precision highp float;

uniform float time;

varying vec3 vPosition;

const float duration = 8.0;
const float delay = 4.0;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  float now = clamp((time - delay) / duration, 0.0, 1.0);
  float opacity = (1.0 - length(vPosition.xy / vec2(512.0))) * 0.6 * now;
  vec3 v = normalize(vPosition);
  vec3 rgb = convertHsvToRgb(vec3(0.5 + (v.x + v.y + v.x) / 40.0 + time * 0.1, 0.4, 1.0));
  gl_FragColor = vec4(rgb, opacity);
}
