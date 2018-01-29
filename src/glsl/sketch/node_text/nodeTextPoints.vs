attribute vec3 position;
attribute vec3 position2;
attribute float opacity;
attribute float opacity2;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying float vOpacity;

void main() {
  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  vOpacity = opacity;

  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = 8.0;
}
