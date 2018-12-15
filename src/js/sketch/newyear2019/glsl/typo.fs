precision highp float;

uniform float time;
uniform sampler2D tex;

varying vec3 vPosition;
varying vec2 vUv;
varying float vTime1;
varying float vTime2;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d)

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  vec4 texColor = texture2D(tex, vUv);

  float noise = cnoise3(vPosition * vec3(1.6)) * 0.5 + 0.5;
  float opacity1 = smoothstep(0.0, 0.01, (1.5 - length(p)) + noise + vTime1 * 2.5 - 2.5);
  float opacity2 = smoothstep(0.0, 0.01, (1.5 - length(p)) + noise + vTime2 * 2.5 - 2.5);
  float opacity = opacity1 * 0.9 - opacity2 * 0.85;

  if (texColor.a < 0.5) discard;
  gl_FragColor = vec4(vec3(1.0), texColor.a * opacity);
}
