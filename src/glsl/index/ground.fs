precision highp float;

uniform float time;

varying vec3 vPosition;

const float duration = 6.0;
const float delay = 1.0;

void main() {
  float now = min((time - delay) / duration, 1.0);
  float opacity = (1.0 - (vPosition.y + 512.0) / 1024.0);
  gl_FragColor = vec4(vec3(0.4), opacity * (now * 2.0 - length(vPosition.xy) / vec2(1024.0, 512.0)));
}
