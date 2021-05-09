attribute vec3 position;

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

varying vec3 vPosition;

void main() {
  // coordinate transformation
  vec4 mPosition = modelMatrix * vec4(position, 1.0);

  vPosition = mPosition.xyz;

  gl_Position = projectionMatrix * viewMatrix * mPosition;
}
