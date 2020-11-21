precision highp float;

uniform float time;
uniform sampler2D texture;

varying vec2 vUv;
varying vec3 vColor;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  vec2 p = vUv * 2.0 - 1.0;

  vec4 texColor = texture2D(texture, vUv);
  vec3 hsv = vec3(0.0);
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb + vColor, 1.0);
}
