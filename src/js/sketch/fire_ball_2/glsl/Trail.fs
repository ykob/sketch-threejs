precision highp float;

uniform float time;
uniform sampler2D noiseTex;

varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  float noise1 = texture2D(noiseTex, vUv + vec2(0.4, -1.6) * time).r;
  float noise2 = texture2D(noiseTex, vUv + vec2(-0.4, -2.4) * time).g;
  float noise = ((noise1 + noise2) * 2.0 - 1.0) * (1.0 - vUv.y) * smoothstep(0.0, 0.15, vUv.y);
  vec3 hsv = vec3(
    noise * 0.35 + time * 0.1,
    1.0 - noise * 1.0,
    0.6 + noise * 0.2
  );
  vec3 rgb = convertHsvToRgb(hsv);
  float opacity = smoothstep(0.5, 1.0, noise);

  if (opacity < 0.1) discard;

  gl_FragColor = vec4(rgb, opacity);
}
