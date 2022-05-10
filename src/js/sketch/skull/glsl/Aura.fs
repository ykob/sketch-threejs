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

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb)

void main() {
  vec4 texColor1 = texture2D(postEffectTex, vUv * 1.05 - 0.025);
  vec4 texColor2 = texture2D(postEffectTex, vUv * vec2(0.8, 0.75) + vec2(0.1, 0.075));
  vec4 texColor3 = texture2D(postEffectTex, vUv * vec2(0.6, 0.55) + vec2(0.2, 0.175));

  float noise1 = texture2D(noiseTex, vUv - vec2(0.0, time * 0.6)).r;
  float noise2 = texture2D(noiseTex, vUv * 2.0 - vec2(0.0, time * 0.7)).g;
  float noise3 = texture2D(noiseTex, vUv * 3.0 + vec2(0.0, time * 0.8)).b;
  float noise = (noise1 * 0.65 + noise2 * 0.3 + noise3 * 0.05);

  float mask1 = (texColor1.r + noise) / 2.0;
  float mask2 = (texColor2.r + (noise * 2.0 - 1.0)) * (1.0 - mask1);
  float mask3 = smoothstep(0.5, 1.0, texColor3.r + noise * 0.5);
  float mask = (mask1 * 2.0 + mask2) / 3.0 * mask3;

  float strength = smoothstep(0.05, 0.17, pow(mask, 3.0));
  vec3 hsv1 = vec3(0.84, 0.4, 0.85);
  vec3 hsv2 = vec3(0.55, 0.05, 0.95);
  vec3 rgb = convertHsvToRgb(mix(hsv1, hsv2, strength));

  float opacity = smoothstep(0.05, 0.055, pow(mask, 3.0));

  if (opacity < 0.01) {
    discard;
  }

  gl_FragColor = vec4(rgb, opacity);
}
