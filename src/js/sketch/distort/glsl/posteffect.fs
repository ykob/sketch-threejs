uniform float time;
uniform vec2 resolution;
uniform float acceleration;
uniform sampler2D texture;

const float blur = 16.0;

varying vec2 vUv;

#pragma glslify: random2 = require(../../../old/glsl/random2)
#pragma glslify: snoise2 = require(glsl-noise/simplex/2d)

vec2 diffUv(float v, float diff) {
  return vUv + (vec2(v + snoise2(vec2(gl_FragCoord.y + time) / 100.0), 0.0) * diff + vec2(v * 3.0, 0.0)) / resolution;
}

float randomNoise(vec2 p) {
  return (random2(p - vec2(sin(time))) * 2.0 - 1.0) * max(length(acceleration), 0.08);
}

void main() {
  float diff = 300.0 * length(acceleration);
  vec2 uv_r = diffUv(0.0, diff);
  vec2 uv_g = diffUv(1.0, diff);
  vec2 uv_b = diffUv(-1.0, diff);
  float r = texture2D(texture, uv_r).r + randomNoise(uv_r);
  float g = texture2D(texture, uv_g).g + randomNoise(uv_g);
  float b = texture2D(texture, uv_b).b + randomNoise(uv_b);
  gl_FragColor = vec4(r, g, b, 1.0);
}
