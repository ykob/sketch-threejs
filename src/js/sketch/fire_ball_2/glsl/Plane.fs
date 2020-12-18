precision highp float;

uniform float time;
uniform sampler2D noiseTex;

varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  float noise1 = texture2D(noiseTex, vUv + vec2(0.0, time * 2.6)).r;
  float noise2 = texture2D(noiseTex, vUv + vec2(0.0, time * 3.2)).g;
  float noise = ((noise1 + noise2) * 2.0 - 1.0) * vUv.y * (1.0 - smoothstep(0.7, 1.0, vUv.y));
  vec3 hsv = vec3(
    noise * 0.35 + time * 0.1,
    0.6 - noise * 0.3,
    0.8
  );
  vec3 rgb = convertHsvToRgb(hsv);
  float opacity = smoothstep(0.5, 0.5, noise);

  if (opacity < 0.1) discard;

  gl_FragColor = vec4(rgb, opacity);
}
