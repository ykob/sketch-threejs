attribute vec2 uv2;
attribute vec3 color;

uniform sampler2D velocity;
uniform sampler2D acceleration;

varying float vAcceleration;
varying vec3 vColor;

void main(void) {
  vec4 update_position = modelViewMatrix * texture2D(velocity, uv2);
  vAcceleration = length(texture2D(acceleration, uv2).xyz);
  vColor = color;
  gl_PointSize = 1.0;
  gl_Position = projectionMatrix * update_position;
}
