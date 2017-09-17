precision highp float;

uniform float brightMin;
uniform sampler2D texture;

varying vec2 vUv;

void main() {
  vec4 bright = max(vec4(0.0), (texture2D(texture, vUv) - brightMin));
  gl_FragColor = bright;
}
