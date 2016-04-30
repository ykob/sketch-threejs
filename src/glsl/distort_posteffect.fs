uniform float time;
uniform vec2 resolution;
uniform float acceleration;
uniform sampler2D texture;

const float blur = 16.0;

varying vec2 vUv;

#pragma glslify: random2 = require(./modules/random2)

float randomNoise(vec2 p) {
  return (random2(p - vec2(sin(time))) * 2.0 - 1.0) * max(length(acceleration), 0.05);
}

void main() {
  float diff = 600.0 * length(acceleration);
  vec2 uv_g = vUv + vec2(cos(time * 2.0), 0.0) * diff / resolution;
  vec2 uv_b = vUv + vec2(cos(-time * 2.0), 0.0) * diff / resolution;
  float r = texture2D(texture, vUv).r + randomNoise(vUv);
  float g = texture2D(texture, uv_g).g + randomNoise(uv_g);
  float b = texture2D(texture, uv_b).b + randomNoise(uv_b);
  gl_FragColor = vec4(r, g, b, 1.0);
}
