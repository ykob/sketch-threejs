attribute vec3 position;
attribute float opacity;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying float vOpacity;

void main(void) {
  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position, 1.0);

  vOpacity = opacity;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
