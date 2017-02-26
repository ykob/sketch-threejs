precision highp float;

uniform vec2 resolution;
uniform sampler2D texture;

varying vec2 vUv;

void main() {
  vec4 color = texture2D(texture, vUv);
  gl_FragColor = color;
}
