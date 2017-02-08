precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: random = require(glsl-util/random);

void main() {
  float whiteNoise = random(vUv.xy * time) * 0.1 - 0.1;
  float r = texture2D(texture, vUv - vec2(2.0, 0.0) / resolution).r;
  float g = texture2D(texture, vUv).g;
  float b = texture2D(texture, vUv + vec2(2.0, 0.0) / resolution).b;
  gl_FragColor = vec4(vec3(r, g, b) + whiteNoise, 1.0);
}
