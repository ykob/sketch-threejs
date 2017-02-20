attribute vec3 position;
attribute vec2 uvVelocity;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform sampler2D velocity;


void main() {
  vec3 v = texture2D(velocity, uvVelocity).xyz;
  gl_PointSize = 1.0;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(v, 1.0);
}
