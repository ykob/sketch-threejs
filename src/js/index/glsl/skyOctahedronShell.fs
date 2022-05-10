precision highp float;

uniform float time;

varying vec3 vPosition;
varying float vOpacity;

const float duration = 4.0;
const float delay = 3.0;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)
#pragma glslify: random = require(@ykob/glsl-util/src/random);

void main() {
  float now = clamp((time - delay) / duration, 0.0, 1.0);
  float noise1 = cnoise3(vec3((vPosition * vec3(0.4, 2.0, -0.6) * 2.0 + time))) * 7.0 - (1.0 + (1.0 - now) * 7.0);
  float noise2 = cnoise3(vec3((vPosition * 42.0 + time)));
  float noise3 = cnoise3(vec3((vPosition * 7.0 + time))) * 2.0;
  float bright = smoothstep(-0.2, 1.0, (noise1 + noise2 + noise3) * now);
  vec3 v = normalize(vPosition);
  vec3 rgb = (1.0 - now) * vec3(1.0) + convertHsvToRgb(vec3(0.5 + (v.x + v.y + v.x) / 40.0 + time * 0.1, 0.4, 1.0));
  float whiteNoise = random(vPosition.xy);
  if (bright < 0.4) discard;
  gl_FragColor = vec4(rgb * vec3(1.0 - bright + 0.6) + whiteNoise * 0.2, 0.4 + vOpacity * 0.5 + sin(time * 2.0) * 0.1);
}
