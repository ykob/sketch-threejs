attribute vec2 uv2;
attribute float force;

uniform sampler2D velocity;

void main(void) {
  vec3 update_position = texture2D(velocity, uv2).xyz * force + position;
  gl_PointSize = 1.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(update_position, 1.0);
}
