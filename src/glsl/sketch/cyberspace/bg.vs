attribute vec3 position;
attribute vec2 uv;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;

varying vec3 vPosition;

void main() {
  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

  vPosition = position;

  gl_Position = projectionMatrix * mvPosition;
}
