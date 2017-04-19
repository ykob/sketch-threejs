precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;

#pragma glslify: random = require(glsl-util/random);
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main(void){
  float whiteNoise = (random(gl_FragCoord.xy + time) * 2.0 - 1.0) * 0.5;

  float noiseX = step((snoise3(vec3(0.0, gl_FragCoord.x / 800.0, time * 600.0)) + 1.0) / 2.0, (sin(time) + 1.0) * 0.1 + 0.2);
  float noiseY = step((snoise3(vec3(0.0, gl_FragCoord.y / 200.0, time * 200.0)) + 1.0) / 2.0, (cos(time) + 1.0) * 0.1 + 0.2);
  float blockNoiseMask = noiseX * noiseY;
  vec4 blockNoise = texture2D(texture, 1.0 - vUv) * blockNoiseMask;

  float waveNoise = (sin(gl_FragCoord.y * 1.4 + time * 20.0) + 1.0) / 2.0 * 0.2;

  gl_FragColor = whiteNoise + blockNoise - waveNoise;
}
