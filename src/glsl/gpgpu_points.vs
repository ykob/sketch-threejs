attribute vec2 uv2;
attribute vec3 color;

uniform sampler2D velocity;

varying vec3 vColor;

void main(void) {
  vec3 update_position = texture2D(velocity, uv2).xyz;
  vColor = color;
  gl_PointSize = 1.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(update_position, 1.0);
}
