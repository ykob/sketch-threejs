precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;

#pragma glslify: random = require(glsl-util/random);
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main(void){
  float rgbWave = (
      snoise3(vec3(0.0, vUv.y * 10.0, time * 200.0)) * 4.0
      * snoise3(vec3(0.0, vUv.y * 40.0, time * 200.0)) * 3.0
      + step(0.9995, sin(vUv.y * 4.0 + time * 1.6)) * 12.0
      + step(0.9999, sin(vUv.y * 4.0 + time * 2.0)) * -18.0
    ) / resolution.x;
  float r = texture2D(texture, vec2(vUv.x + 6.0 / resolution.x + rgbWave * 1.2, vUv.y)).r;
  float g = texture2D(texture, vec2(vUv.x + rgbWave, vUv.y)).g;
  float b = texture2D(texture, vec2(vUv.x - 6.0 / resolution.x + rgbWave * 1.4, vUv.y)).b;

  float whiteNoise = (random(gl_FragCoord.xy + mod(time, 10.0)) * 2.0 - 1.0) * 0.3;

  float blockNoiseTime = floor(time * 20.0);
  float noiseX = step((snoise3(vec3(0.0, gl_FragCoord.x / 300.0, blockNoiseTime * 200.0)) + 1.0) / 2.0, 0.3);
  float noiseY = step((snoise3(vec3(0.0, gl_FragCoord.y / 300.0, blockNoiseTime * 200.0)) + 1.0) / 2.0, 0.2);
  float blockNoiseMask = noiseX * noiseY;
  vec4 blockNoise = texture2D(texture, vUv + sin(blockNoiseTime * 200.0) * 0.2) * blockNoiseMask * 1.5;

  float waveNoise = (sin(gl_FragCoord.y * 1.4) + 1.0) / 2.0 * 0.3;

  gl_FragColor = vec4(r, g, b, 1.0) * (1.0 - blockNoiseMask) + (whiteNoise + blockNoise - waveNoise);
}
