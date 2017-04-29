precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;

#pragma glslify: random = require(glsl-util/random);
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main(void){
  float strength = (cos(time * 0.5) + 1.0) / 2.0;

  float y = vUv.y * resolution.y;
  float rgbWave = (
      snoise3(vec3(0.0, y * 0.025, time * 200.0)) * (2.0 + strength * 20.0)
      * snoise3(vec3(0.0, y * 0.04, time * 200.0)) * (1.0 + strength * 2.0)
      + step(0.9995, sin(y * 0.005 + time * 1.6)) * 12.0
      + step(0.9999, sin(y * 0.005 + time * 2.0)) * -18.0
    ) / resolution.x;
  float r = texture2D(texture, vec2(vUv.x + 6.0 / resolution.x + rgbWave, vUv.y)).r;
  float g = texture2D(texture, vec2(vUv.x + rgbWave, vUv.y)).g;
  float b = texture2D(texture, vec2(vUv.x - 6.0 / resolution.x + rgbWave, vUv.y)).b;

  float whiteNoise = (random(gl_FragCoord.xy + mod(time, 10.0)) * 2.0 - 1.0) * (0.2 + strength * 0.1);

  float blockNoiseTime = floor(time * 20.0);
  float noiseX = step((snoise3(vec3(0.0, gl_FragCoord.x / 480.0, blockNoiseTime * 200.0)) + 1.0) / 2.0, 0.1 + strength * 0.3);
  float noiseY = step((snoise3(vec3(0.0, gl_FragCoord.y / 480.0, blockNoiseTime * 200.0)) + 1.0) / 2.0, 0.1 + strength * 0.2);
  float blockNoiseMask = noiseX * noiseY;
  float blockNoiseUvX = vUv.x + sin(blockNoiseTime * 200.0) * 0.2 + rgbWave;
  float bnr = texture2D(texture, vec2(blockNoiseUvX + 6.0 / resolution.x, vUv.y)).r * blockNoiseMask;
  float bng = texture2D(texture, vec2(blockNoiseUvX, vUv.y)).g * blockNoiseMask;
  float bnb = texture2D(texture, vec2(blockNoiseUvX - 6.0 / resolution.x, vUv.y)).b * blockNoiseMask;
  vec4 blockNoise = vec4(bnr, bng, bnb, 1.0);

  float waveNoise = (sin(gl_FragCoord.y * 1.4) + 1.0) / 2.0 * (0.15 + strength * 0.2);

  gl_FragColor = vec4(r, g, b, 1.0) * (1.0 - blockNoiseMask) + (whiteNoise + blockNoise - waveNoise);
}
