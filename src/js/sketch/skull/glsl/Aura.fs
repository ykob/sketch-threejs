precision highp float;

uniform float time;
uniform vec2 direction;
uniform vec2 resolution;
uniform float radius;
uniform sampler2D postEffectTex;
uniform sampler2D noiseTex;

varying vec3 vPosition;
varying vec2 vUv;

const float blurIteration = 12.0;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  vec4 color = texture2D(postEffectTex, vUv);

  float noise1 = texture2D(noiseTex, vUv - vec2(0.0, time * 0.3)).r;
  float noise2 = texture2D(noiseTex, vUv * 2.0 + vec2(0.0, time * 0.4)).g;
  float noise3 = texture2D(noiseTex, vUv * 3.0 - vec2(0.0, time * 0.5)).b;
  float noise = noise1 * 0.65 + noise2 * 0.3 + noise3 * 0.05;

  float mask = smoothstep(0.0, 0.5, color.r * pow(noise, 3.0)) * 10.0;

  vec3 hsv = vec3(0.5 + mask * 0.4, 0.8 - mask * 0.4, 0.5 + mask);

  gl_FragColor = vec4(convertHsvToRgb(hsv), mask);
}
