precision highp float;

uniform sampler2D tex;

varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(tex, vUv);
  gl_FragColor = texColor;
}
