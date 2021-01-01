precision highp float;

uniform float time;
uniform sampler2D noiseTex;
uniform vec3 acceleration;

varying vec2 vUv;

#pragma glslify: convertHsvToRgb = require(glsl-util/convertHsvToRgb)

void main() {
  float noise1 = texture2D(noiseTex, vUv * vec2(1.0, 0.5) + vec2(0.1, -0.3) * time).r;
  float noise2 = texture2D(noiseTex, vUv * vec2(1.0, 0.5) + vec2(-0.1, -0.6) * time).g;
  float noise3 = texture2D(noiseTex, vUv * vec2(1.0, 0.5) + vec2(0.0, -0.6) * time).b;
  float noise = (noise1 + noise2) / 2.0 * smoothstep(0.0, 0.15, vUv.y) * (1.0 - smoothstep(0.9, 1.0, vUv.y));
  noise = smoothstep(0.5 - min(length(acceleration) / 5.0, 1.0) * 0.15, 1.0, noise);
  vec3 hsv = vec3(
    noise * 0.5 + time * 0.1 + noise3 * 0.3,
    0.7 - noise * 3.0,
    0.6 + noise * 0.6
  );
  vec3 rgb = convertHsvToRgb(hsv);
  float opacity = noise;

  if (opacity < 0.01) discard;

  gl_FragColor = vec4(rgb, opacity);
}
