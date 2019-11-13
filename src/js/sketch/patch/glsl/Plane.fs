precision highp float;

uniform float time;
uniform sampler2D maskTex;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec4 color = texture2D(maskTex, vUv);
  gl_FragColor = color;
}
