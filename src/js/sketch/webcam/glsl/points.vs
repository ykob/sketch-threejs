attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;

const float duration = 4.0;

void main() {
  // Loop animation
  float interval = mod(time, duration) / duration;
  vec3 move = vec3(0.0, 0.0, (interval * 2.0 - 1.0) * 50.0);

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position + move, 1.0);
  float distanceFromCamera = 1000.0 / length(mvPosition.xyz);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = distanceFromCamera;
}
