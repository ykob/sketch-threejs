precision highp float;

uniform float time;
uniform sampler2D texVideo;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);

void main() {
  vec2 p = (vUv * 2.0 - 1.0) * 1.25;
  float grad = 1.0 - pow(length(p), 2.0);
  float noise = cnoise3(vec3(p * 2.4, time * 0.4)) * (0.05 + smoothstep(0.5, 1.0, length(p)));
  float noise2 = cnoise3(vec3(p * 2.4, time * 0.3)) * 0.8;
  float noise3 = cnoise3(vec3(p * 14.0, time * 0.4)) * 0.2;
  vec4 texColor1 = texture2D(texVideo, vUv - vec2(noise - abs(p.x) / 50.0, 0.0));
  vec4 texColor2 = texture2D(texVideo, vUv - vec2(noise, 0.0));
  vec4 texColor3 = texture2D(texVideo, vUv - vec2(noise + abs(p.x) / 50.0, 0.0));
  float mask = grad + noise2 + noise3;
  float opacity = smoothstep(0.13, 0.15, mask) + smoothstep(0.0, 0.02, mask) * (1.0 - smoothstep(0.08, 0.1, mask));
  gl_FragColor = vec4(texColor1.r, texColor2.g, texColor3.b, opacity);
}
