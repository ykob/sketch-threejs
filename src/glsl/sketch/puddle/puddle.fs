precision highp float;

uniform float time;

varying vec2 vUv;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);

void main() {
  float t = mod(time, 2.0) / 2.0;
  vec2 pos = vUv * 2.0 - vec2(1.0);
  float circleOut = smoothstep(0.0, 0.2, 1.0 - length(pos));
  float circleIn = smoothstep(0.0, 0.2, 0.8 - length(pos));
  float noise = (snoise3(vec3(pos, time)) + 1.0) / 2.0;
  float opacity = circleOut - noise + circleIn;
  gl_FragColor = vec4(0.0, 0.0, 0.0, opacity);
}
