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
  vec4 texColor1 = texture2D(postEffectTex, vUv * 1.15 - 0.075);
  vec4 texColor2 = texture2D(postEffectTex, vUv * 0.9 + vec2(0.05, 0.025));
  vec4 texColor3 = texture2D(postEffectTex, vUv * 0.8 + vec2(0.1, 0.05));

  float noise1 = texture2D(noiseTex, vUv - vec2(0.0, time * 0.6)).r;
  float noise2 = texture2D(noiseTex, vUv * 2.0 - vec2(0.0, time * 0.7)).g;
  float noise3 = texture2D(noiseTex, vUv * 3.0 - vec2(0.0, time * 0.8)).b;
  float noise = (noise1 * 0.65 + noise2 * 0.3 + noise3 * 0.05);

  float maskIn = smoothstep(0.4, 1.0, texColor1.r + noise);
  float maskMiddle = smoothstep(0.0, 0.6, texColor2.r + (noise * 2.0 - 1.0) * 4.0);
  float maskOut = smoothstep(0.5, 1.0, texColor3.r + (noise * 2.0 - 1.0) * 0.4);
  float mask = (maskIn * 1.2 + maskMiddle * 0.8) * maskOut * 1.2;

  vec3 hsv = vec3(0.5 + mask * 0.4, 0.8 - mask * 0.2, 0.5 + mask);

  gl_FragColor = vec4(convertHsvToRgb(hsv), mask);
}
