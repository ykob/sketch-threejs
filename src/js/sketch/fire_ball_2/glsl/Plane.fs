precision highp float;

uniform float time;
uniform sampler2D noiseTex;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  float noise1 = texture2D(noiseTex, vUv + vec2(time * 0.1, 0.0)).r;
  float noise2 = texture2D(noiseTex, vUv + vec2(time * -0.1, 0.0)).g;
  vec3 hsv = vec3(
    (noise1 + noise2) * 0.35 + time * 0.1,
    1.0,
    0.02
  );
  vec3 rgb = convertHsvToRgb(hsv);

  gl_FragColor = vec4(rgb, 1.0);
}
