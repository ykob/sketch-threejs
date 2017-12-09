precision highp float;

uniform float time;

varying float vOpacity;

void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, vOpacity);
}
