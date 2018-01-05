precision highp float;

uniform float time;
uniform float wave1;
uniform float wave2;
uniform float wave3;
uniform float wave4;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  // draw lines
  float v1 = sin(vUv.y * wave1 + time * 0.2);
  float v2 = sin(vUv.y * wave2 + time * 0.2);
  float v3 = sin(vUv.y * wave3 + time * 0.2);
  float v4 = sin(vUv.y * wave4 + time * 0.2);
  float v = smoothstep(0.65, 0.7, (v1 + v2 + v3 + v4) / 4.0);
  vec3 color = vec3(v);

  gl_FragColor = vec4(color, v * 0.08);
}
