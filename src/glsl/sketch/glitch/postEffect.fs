precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;

#pragma glslify: random = require(glsl-util/random);
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main(void){
  vec4 baseColor = texture2D(texture, vUv);

  float whiteNoise = (random(gl_FragCoord.xy + mod(time, 10.0)) * 2.0 - 1.0) * 0.4;

  float noiseX = step((snoise3(vec3(0.0, gl_FragCoord.x / 500.0, time * 1000.0)) + 1.0) / 2.0, 0.3);
  float noiseY = step((snoise3(vec3(0.0, gl_FragCoord.y / 400.0, time * 400.0)) + 1.0) / 2.0, 0.3);
  float blockNoiseMask = noiseX * noiseY;
  vec4 blockNoise = texture2D(texture, 1.0 - vUv) * blockNoiseMask;

  float waveNoise = (sin(gl_FragCoord.y * 1.4) + 1.0) / 2.0 * 0.3;

  gl_FragColor = baseColor + (whiteNoise + blockNoise - waveNoise);
}
