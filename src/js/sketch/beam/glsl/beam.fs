precision highp float;

uniform float time;

varying vec3 vPosition;
varying vec2 vUv;
varying float vDelay;
varying vec3 vColor;

const float duration = 3.0;

void main() {
  float now = mod(time + vDelay * duration, duration) / duration;
  float opacityBothEnds = smoothstep(-500.0, -400.0, vPosition.y) * (1.0 - smoothstep(400.0, 500.0, vPosition.y));
  float opacity = smoothstep(0.95, 1.0, mod(vUv.y - now, 1.0));

  gl_FragColor = vec4(vColor, opacity * opacityBothEnds * 0.9);
}
