precision highp float;

uniform float time;
uniform float hex;

varying vec2 vUv;
varying vec3 vColor;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  vec3 rgb = mix(
    convertHsvToRgb(vec3(hex, 0.6, 0.6)),
    convertHsvToRgb(vec3(hex, 0.4, 0.2)),
    vUv.y * 4.0 - 1.0
    );

  gl_FragColor = vec4(rgb, 1.0);
}
