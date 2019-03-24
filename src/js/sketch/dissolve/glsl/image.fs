precision highp float;

uniform float time;
uniform float interval;
uniform float duration;
uniform sampler2D textures[5];

varying vec2 vUv;

#pragma glslify: ease = require(glsl-easings/cubic-in-out)
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

vec4 getTexColor(float index, vec2 uv) {
  vec4 color;
  color += texture2D(textures[0], uv) * (1.0 - step(0.9, index));
  color += texture2D(textures[1], uv) * step(1.0, index) * (1.0 - step(1.9, index));
  color += texture2D(textures[2], uv) * step(2.0, index) * (1.0 - step(2.9, index));
  color += texture2D(textures[3], uv) * step(3.0, index) * (1.0 - step(3.9, index));
  color += texture2D(textures[4], uv) * step(4.0, index) * (1.0 - step(4.9, index));
  return color;
}

void main(void) {
  vec2 p = vUv * 2.0 - 1.0;

  float alpha = ease(clamp(mod(time, interval) / duration - (interval / duration - 1.0), 0.0, 1.0));
  float noise1 = cnoise3(vec3(vUv * vec2(12.0), time * 0.1));
  float noise2 = cnoise3(vec3(vUv * vec2(12.0), time * 0.1 + 100.0));
  float noise3 = cnoise3(vec3(vUv * vec2(48.0), time * 0.3));
  float noiseA = noise1 * 0.85 + noise3 * 0.15;
  float noiseB = noise2 * 0.85 + noise3 * 0.15;

  float mask = clamp(alpha * 2.0 - (noiseA * 0.5 + 0.5), 0.0, 1.0);
  float mask1 = smoothstep(0.5, 1.0, mask);
  float mask2 = smoothstep(0.0, 0.5, mask);

  vec2 uvPrev = (vUv + p * 0.15 * alpha) + vec2(0.2) * vec2(noiseA, noiseB) * length(p) * alpha;
  vec2 uvNext = (vUv - p * 0.15 * (1.0 - alpha)) + vec2(0.2) * vec2(noiseA, noiseB) * length(p) * (1.0 - alpha);

  float indexPrev = floor(mod(time, interval * 5.0) / interval);
  float indexNext = floor(mod(time + interval, interval * 5.0) / interval);

  vec4 texColorPrev = getTexColor(indexPrev, uvPrev) * (1.0 - mask1);
  vec4 texColorNext = getTexColor(indexNext, uvNext) * mask2;

  gl_FragColor = texColorPrev + texColorNext;
}
