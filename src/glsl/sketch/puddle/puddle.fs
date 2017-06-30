precision highp float;

uniform float time;

varying vec2 vUv;

void main() {
  float t = mod(time, 1.0);
  vec2 pos = vUv * 2.0 - vec2(1.0);
  float circleOut = clamp(ceil(min(t, 0.7) - length(pos)), 0.0, 1.0);
  float circleIn = clamp(ceil(t - 0.3 - length(pos)), 0.0, 1.0);
  float opacity = circleOut - circleIn;
  gl_FragColor = vec4(0.0, 0.0, 0.0, opacity);
}
