precision highp float;

uniform float time;
uniform sampler2D noiseTex;

varying vec2 vUv;
varying float vEdge;

#pragma glslify: convertHsvToRgb = require(@ykob/glsl-util/src/convertHsvToRgb)

void main() {
  vec2 p = vUv * 2.0 - 1.0;

  float noise1 = texture2D(noiseTex, vUv + vec2(time * 0.1, 0.0)).r;
  float noise2 = texture2D(noiseTex, vUv + vec2(time * -0.1, 0.0)).g;
  vec3 hsv = vec3(
    (noise1 + noise2) * 0.35 + time * 0.1,
    1.0 - vEdge,
    0.02 + vEdge * 0.98
  );
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, 1.0);
}
