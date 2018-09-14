precision highp float;

uniform float time;
uniform sampler2D tex;

varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
}
