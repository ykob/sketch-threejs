uniform sampler2D velocity;

varying vec2 vUv;

void main(void) {
  gl_FragColor = texture2D(velocity, vUv);
}
