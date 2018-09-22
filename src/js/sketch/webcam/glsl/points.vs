attribute vec3 position;
attribute float delay;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

const float duration = 8.0;

void main() {
  // Loop animation
  float interval = mod(time + delay, duration) / duration;
  vec3 move = vec3(0.0, 0.0, (interval * 2.0 - 1.0) * 100.0);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position + move, 1.0);
  float distanceFromCamera = 1000.0 / length(mvPosition.xyz);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = distanceFromCamera;
}
