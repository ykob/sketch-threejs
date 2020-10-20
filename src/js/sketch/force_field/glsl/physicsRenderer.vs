attribute vec3 position;
attribute vec2 uv;

varying vec2 vUv;

void main(void) {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
