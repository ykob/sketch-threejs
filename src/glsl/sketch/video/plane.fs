precision highp float;

uniform float time;
uniform sampler2D texVideo;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);

void main() {
  vec2 p = vUv * 2.0 - 1.0;
  float noise = cnoise3(vec3(p * 2.0, time * 0.4)) * (0.06 + smoothstep(0.5, 1.0, length(p)) * 0.6);
  vec4 texColor1 = texture2D(texVideo, vUv - vec2(noise, 0.0) - vec2((1.0 + length(p) * 5.0) / gl_FragCoord.x, 0.0));
  vec4 texColor2 = texture2D(texVideo, vUv - vec2(noise, 0.0));
  vec4 texColor3 = texture2D(texVideo, vUv - vec2(noise, 0.0) + vec2((1.0 + length(p) * 5.0) / gl_FragCoord.x, 0.0));
  gl_FragColor = vec4(texColor1.r, texColor2.g, texColor3.b, 1.0);
}
