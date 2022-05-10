precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;

#pragma glslify: random = require(@ykob/glsl-util/src/random);
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

const float interval = 3.0;

void main(void){
  float strength = smoothstep(interval * 0.5, interval, interval - mod(time, interval));
  vec2 shake = vec2(strength * 8.0 + 0.5) * vec2(
    random(vec2(time)) * 2.0 - 1.0,
    random(vec2(time * 2.0)) * 2.0 - 1.0
  ) / resolution;

  float y = vUv.y * resolution.y;
  float rgbWave = (
      snoise3(vec3(0.0, y * 0.01, time * 400.0)) * (2.0 + strength * 32.0)
      * snoise3(vec3(0.0, y * 0.02, time * 200.0)) * (1.0 + strength * 4.0)
      + step(0.9995, sin(y * 0.005 + time * 1.6)) * 12.0
      + step(0.9999, sin(y * 0.005 + time * 2.0)) * -18.0
    ) / resolution.x;
  float rgbDiff = (6.0 + sin(time * 500.0 + vUv.y * 40.0) * (20.0 * strength + 1.0)) / resolution.x;
  float rgbUvX = vUv.x + rgbWave;
  float r = texture2D(texture, vec2(rgbUvX + rgbDiff, vUv.y) + shake).r;
  float g = texture2D(texture, vec2(rgbUvX, vUv.y) + shake).g;
  float b = texture2D(texture, vec2(rgbUvX - rgbDiff, vUv.y) + shake).b;

  float whiteNoise = (random(vUv + mod(time, 10.0)) * 2.0 - 1.0) * (0.15 + strength * 0.15);

  float bnTime = floor(time * 20.0) * 200.0;
  float noiseX = step((snoise3(vec3(0.0, vUv.x * 3.0, bnTime)) + 1.0) / 2.0, 0.12 + strength * 0.3);
  float noiseY = step((snoise3(vec3(0.0, vUv.y * 3.0, bnTime)) + 1.0) / 2.0, 0.12 + strength * 0.3);
  float bnMask = noiseX * noiseY;
  float bnUvX = vUv.x + sin(bnTime) * 0.2 + rgbWave;
  float bnR = texture2D(texture, vec2(bnUvX + rgbDiff, vUv.y)).r * bnMask;
  float bnG = texture2D(texture, vec2(bnUvX, vUv.y)).g * bnMask;
  float bnB = texture2D(texture, vec2(bnUvX - rgbDiff, vUv.y)).b * bnMask;
  vec4 blockNoise = vec4(bnR, bnG, bnB, 1.0);

  float bnTime2 = floor(time * 25.0) * 300.0;
  float noiseX2 = step((snoise3(vec3(0.0, vUv.x * 2.0, bnTime2)) + 1.0) / 2.0, 0.12 + strength * 0.5);
  float noiseY2 = step((snoise3(vec3(0.0, vUv.y * 8.0, bnTime2)) + 1.0) / 2.0, 0.12 + strength * 0.3);
  float bnMask2 = noiseX2 * noiseY2;
  float bnR2 = texture2D(texture, vec2(bnUvX + rgbDiff, vUv.y)).r * bnMask2;
  float bnG2 = texture2D(texture, vec2(bnUvX, vUv.y)).g * bnMask2;
  float bnB2 = texture2D(texture, vec2(bnUvX - rgbDiff, vUv.y)).b * bnMask2;
  vec4 blockNoise2 = vec4(bnR2, bnG2, bnB2, 1.0);

  float waveNoise = (sin(vUv.y * 1200.0) + 1.0) / 2.0 * (0.15 + strength * 0.2);

  gl_FragColor = vec4(r, g, b, 1.0) * (1.0 - bnMask - bnMask2) + (whiteNoise + blockNoise + blockNoise2 - waveNoise);
}
