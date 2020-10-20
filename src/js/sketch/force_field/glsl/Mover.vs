attribute vec3 position;
attribute vec2 uvVelocity;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float time;
uniform vec2 resolution;
uniform float pixelRatio;
uniform sampler2D acceleration;
uniform sampler2D velocity;

varying vec3 vAcceleration;

void main() {
  vec3 a = texture2D(acceleration, uvVelocity).xyz;
  vec3 v = texture2D(velocity, uvVelocity).xyz;
  vec4 mvPosition = modelViewMatrix * vec4(v, 1.0);
  vAcceleration = a;

  // Define the point size.
  float distanceFromCamera = length(mvPosition.xyz);
  float pointSize = 2.0 * resolution.y / 1024.0 * pixelRatio * 50.0 / distanceFromCamera;

  gl_PointSize = pointSize;
  gl_Position = projectionMatrix * mvPosition;
}
