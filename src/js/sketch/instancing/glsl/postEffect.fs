precision highp float;

uniform float time;
uniform vec2 resolution;
uniform sampler2D texture;
uniform float strengthZoom;
uniform float strengthGlitch;

varying vec2 vUv;

#pragma glslify: random = require(@ykob/glsl-util/src/random);
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d)

void main(void){
  // zoom blur
  vec2 tFrag = 1.0 / resolution;
  float nFrag = 1.0 / 30.0;
  vec2 centerOffset = resolution / 2.0;
  vec3 destColor = vec3(0.0);
  vec2 fcc = gl_FragCoord.xy - centerOffset;
  float totalWeight = 0.0;

  for(float i = 0.0; i <= 30.0; i++){
    float percent = (i + random(gl_FragCoord.xy)) * nFrag;
    float weight = percent - percent * percent;
    vec2  t = gl_FragCoord.xy - fcc * percent * strengthZoom * nFrag;
    destColor += texture2D(texture, t * tFrag).rgb * weight;
    totalWeight += weight;
  }
  vec4 zoomColor = vec4(destColor / totalWeight, 1.0);

  // glitch
  float strengthWhiteNoise = min(strengthGlitch * 0.05, 0.1);
  float whiteNoise = (random(gl_FragCoord.xy + time) * 2.0 - 1.0) * (0.05 + strengthWhiteNoise);

  float strengthBlockNoise = min(strengthGlitch * 0.15, 1.2);
  float noiseX = step((snoise3(vec3(0.0, gl_FragCoord.x / resolution.x * 1.0, time * 600.0)) + 1.0) / 2.0, strengthBlockNoise * 0.6);
  float noiseY = step((snoise3(vec3(0.0, gl_FragCoord.y / resolution.y * 3.0, time * 200.0)) + 1.0) / 2.0, strengthBlockNoise * 0.3);
  float blockNoiseMask = noiseX * noiseY;
  vec4 blockNoise = texture2D(texture, 1.0 - vUv) * blockNoiseMask;

  gl_FragColor = zoomColor + whiteNoise + blockNoise;
}
