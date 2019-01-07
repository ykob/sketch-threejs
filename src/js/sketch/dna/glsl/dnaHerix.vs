attribute vec3 position;
attribute float radian;
attribute float radius;
attribute float delay;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float time;

void main() {
  // coordinate transformation
  vec3 updatePosition = position
    + vec3(
      sin(time * 4.0 + delay),
      sin(radian + time * 0.4) * (radius + sin(time * 4.0 + delay)),
      cos(radian + time * 0.4) * (radius + sin(time * 4.0 + delay))
      );
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(updatePosition, 1.0);
  float distanceFromCamera = length(mvPosition.xyz);
  float pointSize = 1000.0 / distanceFromCamera * 1.6;

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = pointSize;
}
