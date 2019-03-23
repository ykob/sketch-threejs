precision highp float;

uniform float time;
uniform float interval;
uniform float duration;
uniform sampler2D textures[5];

varying vec2 vUv;

#pragma glslify: ease = require(glsl-easings/exponential-in-out)
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
  float alpha = ease(clamp(mod(time, interval) / duration, 0.0, 1.0));
  float noise1 = cnoise3(vec3(vUv * vec2(8.0, 12.0), time * 0.1));
  float noise2 = cnoise3(vec3(vUv * vec2(52.0), time));
  float noise = noise1 * 0.85 + noise2 * 0.15;

  vec2 uvPrev = vUv + vec2(0.3, 0.0) * noise * alpha;
  vec2 uvNext = vUv + vec2(0.3, 0.0) * noise * (1.0 - alpha);

  float indexPrev = floor(mod(time - interval, interval * 5.0) / interval);
  float indexNext = floor(mod(time, interval * 5.0) / interval);

  vec4 texColorPrev = getTexColor(indexPrev, uvPrev) * (1.0 - alpha);
  vec4 texColorNext = getTexColor(indexNext, uvNext) * alpha;

  gl_FragColor = texColorPrev + texColorNext;
}
