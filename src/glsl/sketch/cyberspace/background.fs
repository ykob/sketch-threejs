precision highp float;

uniform sampler2D texture;

varying vec3 vPosition;
varying vec2 vUv;

void main() {
  vec4 texColor = texture2D(texture, vUv);

  gl_FragColor = texColor;
}
