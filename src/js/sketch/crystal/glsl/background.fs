precision highp float;

uniform float time;
uniform float hexNext;
uniform float hexPrev;

varying vec2 vUv;
varying vec3 vColor;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);

void main() {
  float hex = mix(hexPrev, hexNext, min(1.0, time));
  vec3 rgb = mix(
    convertHsvToRgb(vec3(hex, 0.6, 0.6)),
    convertHsvToRgb(vec3(hex, 0.4, 0.2)),
    vUv.y * 4.0 - 1.0
    );

  gl_FragColor = vec4(rgb, 1.0);
}
