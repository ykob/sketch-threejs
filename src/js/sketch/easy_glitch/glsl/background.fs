precision highp float;

uniform float time;

varying vec2 vUv;
varying vec3 vColor;

#pragma glslify: random = require(glsl-util/random);

const vec3 rgb1 = vec3(0.0 / 255.0, 0.0 / 255.0, 0.0 / 255.0);
const vec3 rgb2 = vec3(44.0 / 255.0, 58.0 / 255.0, 83.0 / 255.0);

void main() {
  vec3 rgb = mix(rgb1, rgb2, vUv.y * 2.0 - 0.5);
  float noise = random(vUv + vec2(0.0, time * 0.01)) * 0.08;

  gl_FragColor = vec4(rgb + noise, 1.0);
}
