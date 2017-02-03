precision highp float;

uniform float time;

varying vec3 vPosition;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb);
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

void main() {
  float noise1 = smoothstep(0.3, 0.31,
    cnoise3(vec3(vPosition.x * 0.4 - time, vPosition.y * 0.4 - time, vPosition.z * 0.4 + time))
  ) * 0.04;
  float noise2 = cnoise3(vec3(vPosition.x * 0.008 - time, vPosition.y * 0.03 - time, vPosition.z * 0.008 + time));
  if (noise2 + noise1 < 0.4) discard;
  gl_FragColor = vec4(vec3(1.0), 0.5);
}
