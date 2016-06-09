attribute vec3 velocity;

varying vec3 vVelocity;

void main(void) {
  vVelocity = velocity;
  gl_Position = vec4(position, 1.0);
}
