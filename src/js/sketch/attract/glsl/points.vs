attribute vec2 uv2;
attribute vec3 color;
attribute float mass;

uniform sampler2D velocity;
uniform sampler2D acceleration;

varying float vAcceleration;
varying vec3 vColor;
varying float vOpacity;

void main(void) {
  vec4 update_position = modelViewMatrix * texture2D(velocity, uv2);
  vAcceleration = length(texture2D(acceleration, uv2).xyz) * mass;
  vColor = color;
  vOpacity = 0.6 * (300.0 / length(update_position.xyz));
  gl_PointSize = 2.0 * (300.0 / length(update_position.xyz));
  gl_Position = projectionMatrix * update_position;
}
