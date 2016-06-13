attribute vec2 uv2;
attribute vec3 color;

uniform sampler2D velocity;

varying vec3 vColor;

void main(void) {
  vec4 update_position = modelViewMatrix * texture2D(velocity, uv2);
  vColor = color;
  gl_PointSize = 1.0;
  gl_Position = projectionMatrix * update_position;
}
