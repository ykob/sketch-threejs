precision highp float;

uniform float minBright;
uniform sampler2D texture;

varying vec2 vUv;

void main() {
  vec4 bright = max(vec4(0.0), (texture2D(texture, vUv) - minBright));
  gl_FragColor = bright;
}
