precision highp float;

uniform float time;
uniform sampler2D noiseTex;

varying vec2 vUv;
varying vec2 vUvDiff;
varying float vOpacity;
varying float vStep;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  vec2 p = vUv * 2.0 - 1.0;

  float noise = texture2D(noiseTex, (vUv + vUvDiff) * 0.25 + time * 0.1).r * 2.0 - 1.0;
  float stp = smoothstep(0.25, 1.0, vStep);
  noise = smoothstep(0.0 + stp, 0.2 + stp, noise * (1.0 - length(p)));
  float noise2 = texture2D(noiseTex, (vUv + vUvDiff) * 0.125 + time * 0.1).g;

  vec3 hsv = vec3(
    noise2 * 0.5 + time * 0.1,
    0.4 - stp * 5.0,
    0.9 - stp * 5.0
  );
  vec3 rgb = convertHsvToRgb(hsv);
  float opacity = noise * vOpacity;

  gl_FragColor = vec4(rgb, opacity);
}
