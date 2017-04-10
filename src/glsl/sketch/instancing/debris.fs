precision highp float;

uniform float time;

varying vec3 vNormal;

void main() {
  gl_FragColor = vec4(vNormal, 1.0);
}
