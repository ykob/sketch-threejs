precision highp float;

uniform float time;

varying vec2 vUv;
varying vec3 vColor;

#pragma glslify: random = require(@ykob/glsl-util/src/random);

const vec3 rgb1 = vec3(24.0 / 255.0, 32.0 / 255.0, 76.0 / 255.0);
const vec3 rgb2 = vec3(5.0 / 255.0, 6.0 / 255.0, 15.0 / 255.0);

void main() {
  vec3 rgb = mix(rgb1, rgb2, vUv.y * 4.0 - 1.0);
  float noise = random(vUv + vec2(0.0, time * 0.01)) * 0.04;

  gl_FragColor = vec4(rgb + noise, 1.0);
}
