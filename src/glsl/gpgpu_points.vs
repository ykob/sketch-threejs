attribute vec2 uv2;

uniform sampler2D velocity;

void main(void) {
  vec3 update_position = texture2D(velocity, uv2).xyz;
  gl_PointSize = 10.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(update_position, 1.0);
}
