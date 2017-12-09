precision highp float;

uniform float time;

varying vec3 vColor;
varying float vOpacity;

void main() {
  gl_FragColor = vec4(vColor, vOpacity);
}
