attribute vec3 position;
attribute float size;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

void main() {
  // coordinate transformation
  vec4 mvPosition = viewMatrix * modelMatrix * vec4(position, 1.0);

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 5.0 + size;
}
