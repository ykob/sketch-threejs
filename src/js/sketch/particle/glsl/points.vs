attribute vec3 position;
attribute vec2 uvVelocity;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform sampler2D acceleration;
uniform sampler2D velocity;

varying vec3 vAcceleration;

void main() {
  vec3 a = texture2D(acceleration, uvVelocity).xyz;
  vec3 v = texture2D(velocity, uvVelocity).xyz;
  vec4 mvPosition = modelViewMatrix * vec4(v, 1.0);
  vAcceleration = a;
  gl_PointSize = 500.0 / length(mvPosition.xyz);
  gl_Position = projectionMatrix * mvPosition;
}
