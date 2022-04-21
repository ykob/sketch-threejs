precision highp float;

uniform float time;
uniform float hex;

varying vec2 vUv;
varying vec3 vColor;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);

void main() {
  vec3 rgb = mix(
    convertHsvToRgb(vec3(0.5, 0.8, 0.7)),
    convertHsvToRgb(vec3(0.0, 0.2, 0.95)),
    vUv.y * 4.0 - 1.15
    );

  gl_FragColor = vec4(rgb, 1.0);
}
