uniform float time;
uniform vec2 resolution;
uniform float acceleration;
uniform sampler2D texture;

const float blur = 16.0;

varying vec2 vUv;

#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

void main() {
  float diff = 250.0 * length(acceleration);
  float noize = snoise2(vUv * 10000.0 - time) * 0.01 * diff;
  float r = texture2D(texture, vUv).r + noize;
  float g = texture2D(texture, vUv + vec2(cos(time), sin(time)) * diff / resolution).g + noize;
  float b = texture2D(texture, vUv + vec2(cos(-time), sin(-time)) * diff / resolution).b + noize;
  gl_FragColor = vec4(r, g, b, 1.0);
}
