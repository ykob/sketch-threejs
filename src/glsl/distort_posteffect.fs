uniform sampler2D framebuffer;

varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(framebuffer, vUv);
}
